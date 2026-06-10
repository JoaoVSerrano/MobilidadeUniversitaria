package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Gestor;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.GestorResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.GestorMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.GestorRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestorService {

    private final GestorRepository gestorRepository;
    private final EnderecoRepository enderecoRepository;
    private final GestorMapper gestorMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public GestorService(GestorRepository gestorRepository,
                         EnderecoRepository enderecoRepository,
                         GestorMapper gestorMapper,
                         BCryptPasswordEncoder passwordEncoder) {
        this.gestorRepository = gestorRepository;
        this.enderecoRepository = enderecoRepository;
        this.gestorMapper = gestorMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public GestorResponseDTO criar(UsuarioRequestDTO dto) {
        Gestor gestor = gestorMapper.toEntity(dto);
        gestor.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            gestor.setEndereco(endereco);
        }

        Gestor salvo = gestorRepository.save(gestor);
        return gestorMapper.toResponse(salvo);
    }

    public GestorResponseDTO buscarPorId(Long id) {
        Gestor gestor = gestorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gestor nao encontrado com id: " + id));
        return gestorMapper.toResponse(gestor);
    }

    public List<GestorResponseDTO> listarTodos() {
        return gestorRepository.findAll()
                .stream()
                .map(gestorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public GestorResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Gestor gestor = gestorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gestor nao encontrado com id: " + id));

        gestorMapper.updateEntity(gestor, dto);
        gestor.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            gestor.setEndereco(endereco);
        }

        Gestor atualizado = gestorRepository.save(gestor);
        return gestorMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Gestor gestor = gestorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gestor nao encontrado com id: " + id));
        gestorRepository.delete(gestor);
    }
}
