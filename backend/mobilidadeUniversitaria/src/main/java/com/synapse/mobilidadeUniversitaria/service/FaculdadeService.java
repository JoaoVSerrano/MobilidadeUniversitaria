package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import com.synapse.mobilidadeUniversitaria.dtos.request.FaculdadeRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.FaculdadeResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.FaculdadeMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.FaculdadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FaculdadeService {

    private final FaculdadeRepository faculdadeRepository;
    private final EnderecoRepository enderecoRepository;
    private final FaculdadeMapper faculdadeMapper;

    public FaculdadeService(FaculdadeRepository faculdadeRepository,
                            EnderecoRepository enderecoRepository,
                            FaculdadeMapper faculdadeMapper) {
        this.faculdadeRepository = faculdadeRepository;
        this.enderecoRepository = enderecoRepository;
        this.faculdadeMapper = faculdadeMapper;
    }

    public FaculdadeResponseDTO criar(FaculdadeRequestDTO dto) {
        Faculdade faculdade = new Faculdade();
        faculdade.setNome(String.valueOf(dto.nome()));

        if (dto.endereco() != null && dto.endereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.endereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.endereco().getId()));
            faculdade.setEndereco(endereco);
        }

        Faculdade salva = faculdadeRepository.save(faculdade);
        return faculdadeMapper.toResponse(salva);
    }

    public FaculdadeResponseDTO buscarPorId(Long id) {
        Faculdade faculdade = faculdadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + id));
        return faculdadeMapper.toResponse(faculdade);
    }

    public List<FaculdadeResponseDTO> listarTodos() {
        return faculdadeRepository.findAll()
                .stream()
                .map(faculdadeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FaculdadeResponseDTO atualizar(Long id, FaculdadeRequestDTO dto) {
        Faculdade faculdade = faculdadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + id));

        faculdade.setNome(String.valueOf(dto.nome()));

        if (dto.endereco() != null && dto.endereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.endereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.endereco().getId()));
            faculdade.setEndereco(endereco);
        }

        Faculdade atualizada = faculdadeRepository.save(faculdade);
        return faculdadeMapper.toResponse(atualizada);
    }

    public void deletar(Long id) {
        Faculdade faculdade = faculdadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + id));
        faculdadeRepository.delete(faculdade);
    }
}
