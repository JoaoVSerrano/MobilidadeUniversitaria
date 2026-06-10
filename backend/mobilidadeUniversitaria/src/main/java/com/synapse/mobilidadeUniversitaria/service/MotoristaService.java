package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.MotoristaResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.MotoristaMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.MotoristaRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MotoristaService {

    private final MotoristaRepository motoristaRepository;
    private final EnderecoRepository enderecoRepository;
    private final MotoristaMapper motoristaMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public MotoristaService(MotoristaRepository motoristaRepository,
                            EnderecoRepository enderecoRepository,
                            MotoristaMapper motoristaMapper,
                            BCryptPasswordEncoder passwordEncoder) {
        this.motoristaRepository = motoristaRepository;
        this.enderecoRepository = enderecoRepository;
        this.motoristaMapper = motoristaMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public MotoristaResponseDTO criar(MotoristaRequestDTO dto) {
        Motorista motorista = motoristaMapper.toEntity(dto);
        motorista.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            motorista.setEndereco(endereco);
        }

        Motorista salvo = motoristaRepository.save(motorista);
        return motoristaMapper.toResponse(salvo);
    }

    public MotoristaResponseDTO buscarPorId(Long id) {
        Motorista motorista = motoristaRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + id));
        return motoristaMapper.toResponse(motorista);
    }

    public List<MotoristaResponseDTO> listarTodos() {
        return motoristaRepository.findAll()
                .stream()
                .map(motoristaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MotoristaResponseDTO atualizar(Long id, MotoristaRequestDTO dto) {
        Motorista motorista = motoristaRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + id));

        motoristaMapper.updateEntity(motorista, dto);
        motorista.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            motorista.setEndereco(endereco);
        }

        Motorista atualizado = motoristaRepository.save(motorista);
        return motoristaMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Motorista motorista = motoristaRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + id));
        motoristaRepository.delete(motorista);
    }
}
