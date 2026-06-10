package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Veiculo;
import com.synapse.mobilidadeUniversitaria.dtos.request.VeiculoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.VeiculoResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.VeiculoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final VeiculoMapper veiculoMapper;

    public VeiculoService(VeiculoRepository veiculoRepository,
                          VeiculoMapper veiculoMapper) {
        this.veiculoRepository = veiculoRepository;
        this.veiculoMapper = veiculoMapper;
    }

    public VeiculoResponseDTO criar(VeiculoRequestDTO dto) {
        Veiculo veiculo = veiculoMapper.toEntity(dto);
        Veiculo salvo = veiculoRepository.save(veiculo);
        return veiculoMapper.toResponse(salvo);
    }

    public VeiculoResponseDTO buscarPorId(Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + id));
        return veiculoMapper.toResponse(veiculo);
    }

    public List<VeiculoResponseDTO> listarTodos() {
        return veiculoRepository.findAll()
                .stream()
                .map(veiculoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public VeiculoResponseDTO atualizar(Long id, VeiculoRequestDTO dto) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + id));

        veiculoMapper.updateEntity(veiculo, dto);
        Veiculo atualizado = veiculoRepository.save(veiculo);
        return veiculoMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + id));
        veiculoRepository.delete(veiculo);
    }
}
