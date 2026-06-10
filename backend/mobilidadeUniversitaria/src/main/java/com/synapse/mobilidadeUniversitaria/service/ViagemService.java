package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import com.synapse.mobilidadeUniversitaria.Entities.Veiculo;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.ViagemMapper;
import com.synapse.mobilidadeUniversitaria.repositories.MotoristaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.RotaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.VeiculoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final MotoristaRepository motoristaRepository;
    private final VeiculoRepository veiculoRepository;
    private final RotaRepository rotaRepository;
    private final ViagemMapper viagemMapper;

    public ViagemService(ViagemRepository viagemRepository,
                         MotoristaRepository motoristaRepository,
                         VeiculoRepository veiculoRepository,
                         RotaRepository rotaRepository,
                         ViagemMapper viagemMapper) {
        this.viagemRepository = viagemRepository;
        this.motoristaRepository = motoristaRepository;
        this.veiculoRepository = veiculoRepository;
        this.rotaRepository = rotaRepository;
        this.viagemMapper = viagemMapper;
    }

    public ViagemResponseDTO criar(ViagemRequestDTO dto) {
        Motorista motorista = motoristaRepository.findById(dto.motoristaId().intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + dto.motoristaId()));

        Veiculo veiculo = veiculoRepository.findById(dto.veiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + dto.veiculoId()));

        Rota rota = rotaRepository.findById(dto.rotaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + dto.rotaId()));

        Viagem viagem = new Viagem();
        viagem.setDataHoraPartida(dto.dataHoraPartida());
        viagem.setDataHoraChegadaPrevista(dto.dataHoraChegadaPrevista());
        viagem.setMotorista(motorista);
        viagem.setVeiculo(veiculo);
        viagem.setRota(rota);

        Viagem salva = viagemRepository.save(viagem);
        return viagemMapper.toResponse(salva);
    }

    public ViagemResponseDTO buscarPorId(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        return viagemMapper.toResponse(viagem);
    }

    public List<ViagemResponseDTO> listarTodos() {
        return viagemRepository.findAll()
                .stream()
                .map(viagemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ViagemResponseDTO atualizar(Long id, ViagemRequestDTO dto) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));

        Motorista motorista = motoristaRepository.findById(dto.motoristaId().intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + dto.motoristaId()));

        Veiculo veiculo = veiculoRepository.findById(dto.veiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + dto.veiculoId()));

        Rota rota = rotaRepository.findById(dto.rotaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + dto.rotaId()));

        viagem.setDataHoraPartida(dto.dataHoraPartida());
        viagem.setDataHoraChegadaPrevista(dto.dataHoraChegadaPrevista());
        viagem.setMotorista(motorista);
        viagem.setVeiculo(veiculo);
        viagem.setRota(rota);

        Viagem atualizada = viagemRepository.save(viagem);
        return viagemMapper.toResponse(atualizada);
    }

    public void deletar(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        viagemRepository.delete(viagem);
    }
}
