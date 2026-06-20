package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.dtos.request.CriarUsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterSimplificadoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateUserService {

    private final UsuarioService usuarioService;

    public UsuarioResponseDTO criar(RegisterSimplificadoRequestDTO dto) {
        CriarUsuarioRequestDTO request = new CriarUsuarioRequestDTO();
        request.setNome(dto.nome());
        request.setEmail(dto.email());
        request.setCpf(dto.cpf());
        request.setTelefone(dto.telefone());
        request.setTipoUsuario(dto.tipoUsuario() != null ? dto.tipoUsuario() : "ALUNO");
        request.setSenha(dto.senha() != null && !dto.senha().isBlank() ? dto.senha() : "password123");
        return usuarioService.criar(request);
    }
}
