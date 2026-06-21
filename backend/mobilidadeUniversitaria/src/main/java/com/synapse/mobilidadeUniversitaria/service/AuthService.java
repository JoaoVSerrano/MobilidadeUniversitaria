package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.LoginRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterGestorRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterSimplificadoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.JwtResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import com.synapse.mobilidadeUniversitaria.security.AuthenticatedUser;
import com.synapse.mobilidadeUniversitaria.security.JwtService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final GestorService gestorService;
    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;
    private final UsuarioRepository usuarioRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       GestorService gestorService,
                       EnderecoRepository enderecoRepository,
                       EnderecoMapper enderecoMapper,
                       UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.gestorService = gestorService;
        this.enderecoRepository = enderecoRepository;
        this.enderecoMapper = enderecoMapper;
        this.usuarioRepository = usuarioRepository;
    }

    public JwtResponseDTO login(LoginRequestDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return toJwtResponse(user);
    }

    public UsuarioResponseDTO registrarPrimeiroGestor(RegisterGestorRequestDTO dto) {
        if (!usuarioRepository.findByUserType(UserType.GESTOR).isEmpty()) {
            throw new AccessDeniedException("Registro publico permitido apenas para o primeiro gestor");
        }

        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado");
        }

        if (usuarioRepository.existsByCpf(dto.cpf())) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado");
        }

        Endereco endereco = enderecoRepository.save(enderecoMapper.toEntity(dto.endereco()));

        UsuarioRequestDTO gestor = new UsuarioRequestDTO();
        gestor.setNome(dto.nome());
        gestor.setEmail(dto.email());
        gestor.setCpf(dto.cpf());
        gestor.setSenha(dto.senha());
        gestor.setTelefone(dto.telefone());
        gestor.setEnderecoId(endereco.getId());

        return gestorService.criar(gestor);
    }

    public UsuarioResponseDTO registrarUsuarioSimplificado(RegisterSimplificadoRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado");
        }

        if (usuarioRepository.existsByCpf(dto.cpf())) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado");
        }

        // Busca ou cria endereço padrão
        Endereco endereco = enderecoRepository.findById(1L)
                .orElseGet(() -> {
                    Endereco novo = new Endereco();
                    novo.setCep("00000-000");
                    novo.setRua("Não informada");
                    novo.setBairro("Não informado");
                    novo.setNumero("0");
                    novo.setTipoLocal(com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType.RESIDENCIAL);
                    return enderecoRepository.save(novo);
                });

        // Determina o tipo de usuário
        UserType userType = UserType.ALUNO;
        if (dto.tipoUsuario() != null) {
            try {
                userType = UserType.valueOf(dto.tipoUsuario().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setCpf(dto.cpf());
        usuario.setTelefone(dto.telefone());
        usuario.setUserType(userType);
        usuario.setSenha(dto.senha()); // Será encoded pelo service

        // Usa o GestorService para criar o usuário (que já tem a lógica de encoding)
        UsuarioRequestDTO request = new UsuarioRequestDTO();
        request.setNome(dto.nome());
        request.setEmail(dto.email());
        request.setCpf(dto.cpf());
        request.setSenha(dto.senha());
        request.setTelefone(dto.telefone());
        request.setEnderecoId(endereco.getId());

        return gestorService.criar(request);
    }

    private JwtResponseDTO toJwtResponse(AuthenticatedUser user) {
        return new JwtResponseDTO(
                jwtService.gerarToken(user),
                "Bearer",
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getUserType()
        );
    }

    public AuthenticatedUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser) {
            return (AuthenticatedUser) authentication.getPrincipal();
        }
        return null;
    }

    public boolean canAccessNotificacao(Long id) {
        // Implementação simplificada - permite acesso se o usuário estiver autenticado
        return currentUser() != null;
    }
}
