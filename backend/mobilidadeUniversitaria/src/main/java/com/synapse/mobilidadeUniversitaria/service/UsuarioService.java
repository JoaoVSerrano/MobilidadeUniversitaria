package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.CriarUsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import com.synapse.mobilidadeUniversitaria.security.AuthorizationService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoMapper enderecoMapper;
    private final EnderecoRepository enderecoRepository;
    private final UsuarioValidationService usuarioValidationService;
    private final PasswordEncoder passwordEncoder;
    private final AuthorizationService authorizationService;

    @PersistenceContext
    private EntityManager entityManager;

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

    @Transactional
    public UsuarioResponseDTO criar(CriarUsuarioRequestDTO dto) {
        // Busca ou cria endereço padrão
        Endereco endereco = enderecoRepository.findById(1L)
                .orElseGet(() -> {
                    Endereco novo = new Endereco();
                    novo.setCep("00000-000");
                    novo.setRua("Não informada");
                    novo.setBairro("Não informado");
                    novo.setNumero("0");
                    novo.setTipoLocal(LocalType.RESIDENCIAL);
                    return enderecoRepository.save(novo);
                });

        // Parse user type
        UserType userType;
        try {
            userType = UserType.valueOf(dto.getTipoUsuario().toUpperCase());
        } catch (IllegalArgumentException e) {
            userType = UserType.ALUNO;
        }

        // Cria usuário
        Usuario usuario;
        if (userType == UserType.ALUNO) {
            com.synapse.mobilidadeUniversitaria.Entities.Aluno aluno = new com.synapse.mobilidadeUniversitaria.Entities.Aluno();
            aluno.setStatusMatricula(com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula.ATIVA);
            usuario = aluno;
        } else if (userType == UserType.MOTORISTA) {
            com.synapse.mobilidadeUniversitaria.Entities.Motorista motorista = new com.synapse.mobilidadeUniversitaria.Entities.Motorista();
            motorista.setCnhNumero("00000000000"); // default value
            motorista.setVencimentoCnh(java.time.LocalDate.now().plusYears(1)); // default value
            usuario = motorista;
        } else {
            usuario = new Usuario();
        }

        // Não setar ID - deixar JPA gerar automaticamente
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());
        usuario.setUserType(userType);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha() != null ? dto.getSenha() : "password123"));
        usuario.setEndereco(endereco);

        // Usa persist para inserção direta
        entityManager.persist(usuario);
        entityManager.flush();

        return toResponse(usuario);
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