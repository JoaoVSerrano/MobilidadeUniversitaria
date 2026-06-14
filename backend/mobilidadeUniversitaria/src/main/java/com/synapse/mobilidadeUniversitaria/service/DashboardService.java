package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.PresencaDigital;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.response.DashboardGestorResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.DemandaPorDiaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.OcupacaoPorRotaResponseDTO;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.PresencaDigitalRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AlunoRepository alunoRepository;
    private final ViagemRepository viagemRepository;
    private final PresencaDigitalRepository presencaRepository;

    public DashboardService(AlunoRepository alunoRepository,
                            ViagemRepository viagemRepository,
                            PresencaDigitalRepository presencaRepository) {
        this.alunoRepository = alunoRepository;
        this.viagemRepository = viagemRepository;
        this.presencaRepository = presencaRepository;
    }

    public DashboardGestorResponseDTO dashboardGestor() {
        List<Viagem> viagensHoje = viagensHoje();
        long presencasHoje = presencasDasViagens(viagensHoje);
        int capacidadeHoje = viagensHoje.stream()
                .filter(viagem -> viagem.getVeiculo() != null)
                .mapToInt(viagem -> viagem.getVeiculo().getCapacidadeTotal())
                .sum();

        double taxaOcupacao = capacidadeHoje == 0 ? 0 : (presencasHoje * 100.0) / capacidadeHoje;

        return new DashboardGestorResponseDTO(
                alunoRepository.count(),
                taxaOcupacao,
                viagensHoje.size(),
                0
        );
    }

    public List<OcupacaoPorRotaResponseDTO> ocupacaoPorRota() {
        return viagemRepository.findAll()
                .stream()
                .filter(viagem -> viagem.getRota() != null)
                .collect(Collectors.groupingBy(Viagem::getRota))
                .entrySet()
                .stream()
                .map(entry -> {
                    List<Viagem> viagens = entry.getValue();
                    long presencas = presencasDasViagens(viagens);
                    int capacidade = viagens.stream()
                            .filter(viagem -> viagem.getVeiculo() != null)
                            .mapToInt(viagem -> viagem.getVeiculo().getCapacidadeTotal())
                            .sum();
                    double ocupacao = capacidade == 0 ? 0 : (presencas * 100.0) / capacidade;
                    return new OcupacaoPorRotaResponseDTO(
                            entry.getKey().getId(),
                            entry.getKey().getNomeRota(),
                            presencas,
                            capacidade,
                            ocupacao
                    );
                })
                .toList();
    }

    public List<DemandaPorDiaResponseDTO> demandaPorDia() {
        Map<String, Long> presencasPorDia = presencaRepository.findAll()
                .stream()
                .filter(presenca -> presenca.getDataHoraValidacao() != null)
                .collect(Collectors.groupingBy(
                        presenca -> presenca.getDataHoraValidacao().getDayOfWeek()
                                .getDisplayName(TextStyle.FULL, Locale.forLanguageTag("pt-BR")),
                        Collectors.counting()
                ));

        return presencasPorDia.entrySet()
                .stream()
                .map(entry -> new DemandaPorDiaResponseDTO(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<Viagem> viagensHoje() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicio = hoje.atStartOfDay();
        LocalDateTime fim = hoje.plusDays(1).atStartOfDay();
        return viagemRepository.findByDataHoraPartidaBetween(inicio, fim);
    }

    private long presencasDasViagens(List<Viagem> viagens) {
        return viagens.stream()
                .map(Viagem::getId)
                .mapToLong(viagemId -> presencaRepository.findByViagemId(viagemId).size())
                .sum();
    }
}
