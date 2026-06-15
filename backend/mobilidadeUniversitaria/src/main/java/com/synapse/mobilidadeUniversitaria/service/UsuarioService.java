package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import com.synapse.mobilidadeUniversitaria.security.AuthorizationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoMapper enderecoMapper;
    private final EnderecoRepository enderecoRepository;
    private final UsuarioValidationService usuarioValidationService;
    private final PasswordEncoder passwordEncoder;
    private final AuthorizationService authorizationService;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          EnderecoMapper enderecoMapper,
                          EnderecoRepository enderecoRepository,
                          UsuarioValidationService usuarioValidationService,
                          PasswordEncoder passwordEncoder,
                          AuthorizationService authorizationService) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoMapper = enderecoMapper;
        this.enderecoRepository = enderecoRepository;
        this.usuarioValidationService = usuarioValidationService;
        this.passwordEncoder = passwordEncoder;
        this.authorizationService = authorizationService;
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

    public UsuarioResponseDTO buscarUsuarioLogado() {
        return buscarPorId(authorizationService.currentUser().getId());
    }

    public UsuarioResponseDTO atualizarUsuarioLogado(UsuarioUpdateRequestDTO dto) {
        Long usuarioId = authorizationService.currentUser().getId();
        Usuario usuario = buscarUsuarioPorId(usuarioId);
        usuarioValidationService.validarAtualizacao(usuarioId, dto);

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());
        usuario.setEndereco(enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEnderecoId())));

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        return toResponse(usuarioRepository.save(usuario));
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
