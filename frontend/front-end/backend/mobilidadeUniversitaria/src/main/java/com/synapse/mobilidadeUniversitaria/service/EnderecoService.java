package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.dtos.request.EnderecoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.EnderecoResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;

    public EnderecoService(EnderecoRepository enderecoRepository,
                           EnderecoMapper enderecoMapper) {
        this.enderecoRepository = enderecoRepository;
        this.enderecoMapper = enderecoMapper;
    }

    public EnderecoResponseDTO criar(EnderecoRequestDTO dto) {
        Endereco endereco = enderecoMapper.toEntity(dto);
        Endereco salvo = enderecoRepository.save(endereco);
        return enderecoMapper.toResponse(salvo);
    }

    public EnderecoResponseDTO buscarPorId(Long id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + id));
        return enderecoMapper.toResponse(endereco);
    }

    public List<EnderecoResponseDTO> listarTodos() {
        return enderecoRepository.findAll()
                .stream()
                .map(enderecoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public EnderecoResponseDTO atualizar(Long id, EnderecoRequestDTO dto) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + id));

        enderecoMapper.updateEntity(endereco, dto);
        Endereco atualizado = enderecoRepository.save(endereco);
        return enderecoMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + id));
        enderecoRepository.delete(endereco);
    }
}
