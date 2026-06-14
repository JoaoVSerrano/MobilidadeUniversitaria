package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoMapper enderecoMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, EnderecoMapper enderecoMapper) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoMapper = enderecoMapper;
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        return toResponse(buscarUsuarioPorId(id));
    }

    public List<UsuarioResponseDTO> listarPorTipo(UserType tipoUsuario) {
        return usuarioRepository.findByUserType(tipoUsuario)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioStatsResponseDTO estatisticas() {
        long totalAlunos = usuarioRepository.findByUserType(UserType.ALUNO).size();
        long totalMotoristas = usuarioRepository.findByUserType(UserType.MOTORISTA).size();
        long totalGestores = usuarioRepository.findByUserType(UserType.GESTOR).size();

        return new UsuarioStatsResponseDTO(
                usuarioRepository.count(),
                totalAlunos,
                totalMotoristas,
                totalGestores
        );
    }

    public void deletar(Long id) {
        Usuario usuario = buscarUsuarioPorId(id);
        usuarioRepository.delete(usuario);
    }

    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id: " + id));
    }

    private UsuarioResponseDTO toResponse(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setCpf(usuario.getCpf());
        dto.setTipoUsuario(usuario.getUserType());
        dto.setTelefone(usuario.getTelefone());
        dto.setEndereco(enderecoMapper.toResponse(usuario.getEndereco()));
        return dto;
    }
}
