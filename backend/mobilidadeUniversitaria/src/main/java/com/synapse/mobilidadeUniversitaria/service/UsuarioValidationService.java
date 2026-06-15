package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioDadosDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioValidationService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioValidationService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void validarCriacao(UsuarioDadosDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado: " + dto.getEmail());
        }

        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado: " + dto.getCpf());
        }
    }

    public void validarAtualizacao(Long usuarioId, UsuarioDadosDTO dto) {
        if (usuarioRepository.existsByEmailAndIdNot(dto.getEmail(), usuarioId)) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado: " + dto.getEmail());
        }

        if (usuarioRepository.existsByCpfAndIdNot(dto.getCpf(), usuarioId)) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado: " + dto.getCpf());
        }
    }
}
