package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import com.synapse.mobilidadeUniversitaria.dtos.request.RotaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.RotaMapper;
import com.synapse.mobilidadeUniversitaria.repositories.RotaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RotaService {

    private final RotaRepository rotaRepository;
    private final RotaMapper rotaMapper;
    private final VeiculoRepository veiculoRepository;

    public RotaService(RotaRepository rotaRepository,
                       RotaMapper rotaMapper,
                       VeiculoRepository veiculoRepository) {
        this.rotaRepository = rotaRepository;
        this.rotaMapper = rotaMapper;
        this.veiculoRepository = veiculoRepository;
    }

    public RotaResponseDTO criar(RotaRequestDTO dto) {
        Rota rota = rotaMapper.toEntity(dto);
        Rota salva = rotaRepository.save(rota);
        return rotaMapper.toResponse(salva);
    }

    public RotaResponseDTO buscarPorId(Long id) {
        Rota rota = rotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + id));
        return rotaMapper.toResponse(rota);
    }

    public List<RotaResponseDTO> listarTodos() {
        return rotaRepository.findAll()
                .stream()
                .map(rotaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public RotaResponseDTO atualizar(Long id, RotaRequestDTO dto) {
        Rota rota = rotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + id));

        rotaMapper.updateEntity(rota, dto);
        Rota atualizada = rotaRepository.save(rota);
        return rotaMapper.toResponse(atualizada);
    }

    public void deletar(Long id) {
        Rota rota = rotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + id));
        rotaRepository.delete(rota);
    }

    public RotaStatsResponseDTO estatisticas() {
        int capacidadeTotal = veiculoRepository.findAll()
                .stream()
                .mapToInt(veiculo -> veiculo.getCapacidadeTotal())
                .sum();
        return new RotaStatsResponseDTO(rotaRepository.count(), capacidadeTotal);
    }
}
