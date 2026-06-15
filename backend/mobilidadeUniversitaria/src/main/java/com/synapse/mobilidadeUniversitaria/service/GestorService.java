package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioDadosDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestorService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidationService usuarioValidationService;

    public GestorService(UsuarioRepository usuarioRepository,
                         EnderecoRepository enderecoRepository,
                         EnderecoMapper enderecoMapper,
                         PasswordEncoder passwordEncoder,
                         UsuarioValidationService usuarioValidationService) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.enderecoMapper = enderecoMapper;
        this.passwordEncoder = passwordEncoder;
        this.usuarioValidationService = usuarioValidationService;
    }

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        usuarioValidationService.validarCriacao(dto);

        Usuario gestor = new Usuario();
        atualizarCamposComuns(gestor, dto);
        gestor.setUserType(UserType.GESTOR);
        gestor.setSenha(passwordEncoder.encode(dto.getSenha()));

        Usuario salvo = usuarioRepository.save(gestor);
        return toResponse(salvo);
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario gestor = buscarGestorPorId(id);
        return toResponse(gestor);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findByUserType(UserType.GESTOR)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioUpdateRequestDTO dto) {
        Usuario gestor = buscarGestorPorId(id);
        usuarioValidationService.validarAtualizacao(gestor.getId(), dto);

        atualizarCamposComuns(gestor, dto);
        gestor.setUserType(UserType.GESTOR);
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            gestor.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        Usuario atualizado = usuarioRepository.save(gestor);
        return toResponse(atualizado);
    }

    public void deletar(Long id) {
        Usuario gestor = buscarGestorPorId(id);
        usuarioRepository.delete(gestor);
    }

    private Usuario buscarGestorPorId(Long id) {
        return usuarioRepository.findByIdAndUserType(id, UserType.GESTOR)
                .orElseThrow(() -> new ResourceNotFoundException("Gestor nao encontrado com id: " + id));
    }

    private void atualizarCamposComuns(Usuario usuario, UsuarioDadosDTO dto) {
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());

        Endereco endereco = enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEnderecoId()));
        usuario.setEndereco(endereco);
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
