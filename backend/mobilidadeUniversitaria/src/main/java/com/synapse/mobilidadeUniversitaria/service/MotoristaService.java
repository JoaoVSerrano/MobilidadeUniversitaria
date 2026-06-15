package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.MotoristaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.MotoristaMapper;
import com.synapse.mobilidadeUniversitaria.mapper.ViagemMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.MotoristaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MotoristaService {

    private final MotoristaRepository motoristaRepository;
    private final EnderecoRepository enderecoRepository;
    private final MotoristaMapper motoristaMapper;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidationService usuarioValidationService;
    private final ViagemRepository viagemRepository;
    private final ViagemMapper viagemMapper;

    public MotoristaService(MotoristaRepository motoristaRepository,
                            EnderecoRepository enderecoRepository,
                            MotoristaMapper motoristaMapper,
                            PasswordEncoder passwordEncoder,
                            UsuarioValidationService usuarioValidationService,
                            ViagemRepository viagemRepository,
                            ViagemMapper viagemMapper) {
        this.motoristaRepository = motoristaRepository;
        this.enderecoRepository = enderecoRepository;
        this.motoristaMapper = motoristaMapper;
        this.passwordEncoder = passwordEncoder;
        this.usuarioValidationService = usuarioValidationService;
        this.viagemRepository = viagemRepository;
        this.viagemMapper = viagemMapper;
    }

    public MotoristaResponseDTO criar(MotoristaRequestDTO dto) {
        usuarioValidationService.validarCriacao(dto);

        Motorista motorista = motoristaMapper.toEntity(dto);
        motorista.setUserType(UserType.MOTORISTA);
        motorista.setSenha(passwordEncoder.encode(dto.getSenha()));
        motorista.setEndereco(buscarEndereco(dto.getEnderecoId()));

        Motorista salvo = motoristaRepository.save(motorista);
        return motoristaMapper.toResponse(salvo);
    }

    public MotoristaResponseDTO buscarPorId(Long id) {
        Motorista motorista = buscarMotoristaPorId(id);
        return motoristaMapper.toResponse(motorista);
    }

    public List<MotoristaResponseDTO> listarTodos() {
        return motoristaRepository.findAll()
                .stream()
                .map(motoristaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MotoristaResponseDTO atualizar(Long id, MotoristaUpdateRequestDTO dto) {
        Motorista motorista = buscarMotoristaPorId(id);
        usuarioValidationService.validarAtualizacao(motorista.getId(), dto);

        motoristaMapper.updateEntity(motorista, dto);
        motorista.setUserType(UserType.MOTORISTA);
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            motorista.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        motorista.setEndereco(buscarEndereco(dto.getEnderecoId()));

        Motorista atualizado = motoristaRepository.save(motorista);
        return motoristaMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Motorista motorista = buscarMotoristaPorId(id);
        motoristaRepository.delete(motorista);
    }

    public List<ViagemResponseDTO> listarViagens(Long motoristaId) {
        buscarMotoristaPorId(motoristaId);
        return viagemRepository.findByMotoristaId(motoristaId)
                .stream()
                .map(viagemMapper::toResponse)
                .toList();
    }

    private Motorista buscarMotoristaPorId(Long id) {
        return motoristaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + id));
    }

    private Endereco buscarEndereco(Long enderecoId) {
        return enderecoRepository.findById(enderecoId)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + enderecoId));
    }
}
