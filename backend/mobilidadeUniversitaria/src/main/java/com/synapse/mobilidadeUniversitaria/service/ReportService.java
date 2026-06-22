package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;
import com.synapse.mobilidadeUniversitaria.dtos.response.*;
import com.synapse.mobilidadeUniversitaria.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ViagemRepository viagemRepository;
    private final AlunoRepository alunoRepository;
    private final PresencaDigitalRepository presencaDigitalRepository;
    private final VeiculoRepository veiculoRepository;
    private final RotaRepository rotaRepository;

    public ReportMetricsDTO getDashboardMetrics(LocalDateTime inicio, LocalDateTime fim) {
        List<Viagem> viagens = inicio != null && fim != null
                ? viagemRepository.findByDataHoraPartidaBetween(inicio, fim)
                : viagemRepository.findAll();

        long totalViagens = viagens.size();

        // Ocupação média
        double ocupacaoMedia = viagens.stream()
                .mapToDouble(v -> {
                    if (v.getVeiculo() == null || v.getVeiculo().getCapacidadeTotal() == 0) return 0;
                    long presencas = presencaDigitalRepository.findByViagemId(v.getId()).size();
                    return (presencas * 100.0) / v.getVeiculo().getCapacidadeTotal();
                })
                .average()
                .orElse(0.0);

        // Pontualidade: viagens finalizadas vs total
        long finalizadas = viagens.stream()
                .filter(v -> ViagemStatus.FINALIZADA.equals(v.getStatus()))
                .count();
        double pontualidade = totalViagens == 0 ? 0 : (finalizadas * 100.0) / totalViagens;

        // Alunos
        long totalAlunos = alunoRepository.count();

        // Veículos
        long totalVeiculos = veiculoRepository.count();
        long veiculosManutencao = veiculoRepository.findAll().stream()
                .filter(v -> "MANUTENCAO".equalsIgnoreCase(v.getStatus()))
                .count();
        long veiculosAtivos = totalVeiculos - veiculosManutencao;

        return new ReportMetricsDTO(
                totalViagens, 0.0,
                Math.round(ocupacaoMedia * 10.0) / 10.0, 0.0,
                Math.round(pontualidade * 10.0) / 10.0,
                totalAlunos, 0L,
                veiculosAtivos, totalVeiculos, veiculosManutencao
        );
    }

    public List<TripsOccupancyDTO> getTripsAndOccupancy() {
        List<Viagem> all = viagemRepository.findAll();
        Map<String, List<Viagem>> byMonth = all.stream()
                .collect(Collectors.groupingBy(v -> {
                    LocalDateTime dt = v.getDataHoraPartida();
                    return dt.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"))
                            + "/" + dt.getYear();
                }));

        return byMonth.entrySet().stream()
                .map(e -> {
                    List<Viagem> viagens = e.getValue();
                    double ocp = viagens.stream()
                            .mapToDouble(v -> {
                                if (v.getVeiculo() == null || v.getVeiculo().getCapacidadeTotal() == 0) return 0;
                                long presencas = presencaDigitalRepository.findByViagemId(v.getId()).size();
                                return (presencas * 100.0) / v.getVeiculo().getCapacidadeTotal();
                            }).average().orElse(0.0);
                    return new TripsOccupancyDTO(e.getKey(), viagens.size(), Math.round(ocp * 10.0) / 10.0);
                })
                .sorted(Comparator.comparing(TripsOccupancyDTO::getMes))
                .collect(Collectors.toList());
    }

    public List<AttendanceByUniversityDTO> getAttendanceByUniversity() {
        return alunoRepository.findAll().stream()
                .filter(a -> a.getFaculdade() != null)
                .collect(Collectors.groupingBy(a -> a.getFaculdade().getNome()))
                .entrySet().stream()
                .map(e -> {
                    long total = e.getValue().size();
                    long presentes = e.getValue().stream()
                            .mapToLong(a -> presencaDigitalRepository.findByAlunoId(a.getId())
                                    .stream()
                                    .filter(p -> com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus.CONFIRMADA
                                            .equals(p.getStatus()))
                                    .count())
                            .sum();
                    return new AttendanceByUniversityDTO(e.getKey(), total, presentes);
                })
                .sorted(Comparator.comparing(AttendanceByUniversityDTO::getFaculdade))
                .collect(Collectors.toList());
    }

    public List<ScheduleDistributionDTO> getScheduleDistribution(String periodo) {
        List<Viagem> viagens = viagemRepository.findAll();

        if ("manha".equalsIgnoreCase(periodo)) {
            viagens = viagens.stream()
                    .filter(v -> v.getDataHoraPartida().getHour() >= 6 && v.getDataHoraPartida().getHour() < 12)
                    .collect(Collectors.toList());
        } else if ("tarde".equalsIgnoreCase(periodo)) {
            viagens = viagens.stream()
                    .filter(v -> v.getDataHoraPartida().getHour() >= 12 && v.getDataHoraPartida().getHour() < 18)
                    .collect(Collectors.toList());
        } else if ("noite".equalsIgnoreCase(periodo)) {
            viagens = viagens.stream()
                    .filter(v -> v.getDataHoraPartida().getHour() >= 18 || v.getDataHoraPartida().getHour() < 6)
                    .collect(Collectors.toList());
        }

        // Faixas de 2 horas
        int[][] faixas = {{6, 8}, {8, 10}, {10, 12}, {12, 14}, {14, 16}, {16, 18}, {18, 20}};
        long total = viagens.size();
        List<ScheduleDistributionDTO> result = new ArrayList<>();

        for (int[] faixa : faixas) {
            int h1 = faixa[0], h2 = faixa[1];
            final List<Viagem> viagensRef = viagens;
            long count = viagensRef.stream()
                    .filter(v -> v.getDataHoraPartida().getHour() >= h1 && v.getDataHoraPartida().getHour() < h2)
                    .count();
            double pct = total == 0 ? 0 : Math.round((count * 100.0 / total) * 10.0) / 10.0;
            result.add(new ScheduleDistributionDTO(
                    String.format("%02d:00–%02d:00", h1, h2), count, pct));
        }
        return result;
    }

    public List<RoutePerformanceDTO> getRoutePerformance() {
        return rotaRepository.findAll().stream()
                .map(rota -> {
                    List<Viagem> viagens = viagemRepository.findAll().stream()
                            .filter(v -> v.getRota() != null && v.getRota().getId().equals(rota.getId()))
                            .collect(Collectors.toList());
                    long totalViagens = viagens.size();
                    double mediaOcupacao = viagens.stream()
                            .mapToDouble(v -> {
                                if (v.getVeiculo() == null || v.getVeiculo().getCapacidadeTotal() == 0) return 0;
                                long presencas = presencaDigitalRepository.findByViagemId(v.getId()).size();
                                return (presencas * 100.0) / v.getVeiculo().getCapacidadeTotal();
                            }).average().orElse(0.0);
                    long alunosTransportados = viagens.stream()
                            .mapToLong(v -> presencaDigitalRepository.findByViagemId(v.getId())
                                    .stream()
                                    .filter(p -> com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus.CONFIRMADA
                                            .equals(p.getStatus()))
                                    .count())
                            .sum();

                    String status;
                    if (mediaOcupacao >= 85) status = "Ótimo";
                    else if (mediaOcupacao >= 70) status = "Regular";
                    else status = "Baixo";

                    return new RoutePerformanceDTO(
                            rota.getId(), rota.getNomeRota(), totalViagens,
                            Math.round(mediaOcupacao * 10.0) / 10.0,
                            alunosTransportados, status
                    );
                })
                .sorted(Comparator.comparing(RoutePerformanceDTO::getNomeRota))
                .collect(Collectors.toList());
    }

    public List<ReportInsightDTO> getInsights() {
        List<ReportInsightDTO> insights = new ArrayList<>();
        List<RoutePerformanceDTO> routes = getRoutePerformance();

        if (routes.isEmpty()) {
            insights.add(new ReportInsightDTO("info", "info",
                    "Sem dados suficientes",
                    "Crie viagens e registre presenças para gerar insights automáticos."));
            return insights;
        }

        // Melhor rota
        routes.stream()
                .max(Comparator.comparingDouble(RoutePerformanceDTO::getMediaOcupacao))
                .ifPresent(r -> insights.add(new ReportInsightDTO("success", "trending-up",
                        "Rota com maior ocupação",
                        r.getNomeRota() + " tem " + r.getMediaOcupacao() + "% de ocupação média.")));

        // Rota com baixa utilização
        routes.stream()
                .filter(r -> r.getMediaOcupacao() < 50)
                .findFirst()
                .ifPresent(r -> insights.add(new ReportInsightDTO("warning", "alert-triangle",
                        "Rota com baixa utilização",
                        r.getNomeRota() + " tem apenas " + r.getMediaOcupacao() + "% de ocupação. Considere redistribuir a demanda.")));

        // Total de alunos transportados
        long totalAlunos = routes.stream().mapToLong(RoutePerformanceDTO::getAlunosTransportados).sum();
        if (totalAlunos > 0) {
            insights.add(new ReportInsightDTO("info", "users",
                    "Alunos transportados",
                    totalAlunos + " alunos confirmados nas viagens realizadas no sistema."));
        }

        // Tendência de crescimento
        long totalViagens = routes.stream().mapToLong(RoutePerformanceDTO::getTotalViagens).sum();
        if (totalViagens > 0) {
            insights.add(new ReportInsightDTO("success", "bar-chart",
                    "Tendência de crescimento",
                    "Total de " + totalViagens + " viagens registradas. Continue monitorando para otimizar rotas."));
        }

        return insights;
    }
}
