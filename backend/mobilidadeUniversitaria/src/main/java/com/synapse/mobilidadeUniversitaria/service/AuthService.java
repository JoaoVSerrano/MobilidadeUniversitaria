package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.LoginRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterGestorRequestDTO;
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
}
