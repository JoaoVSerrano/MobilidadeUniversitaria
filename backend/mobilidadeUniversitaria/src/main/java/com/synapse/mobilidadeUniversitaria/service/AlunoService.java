package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.AlunoResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.AlunoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.FaculdadeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final EnderecoRepository enderecoRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final AlunoMapper alunoMapper;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository,
                        EnderecoRepository enderecoRepository,
                        FaculdadeRepository faculdadeRepository,
                        AlunoMapper alunoMapper,
                        PasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.enderecoRepository = enderecoRepository;
        this.faculdadeRepository = faculdadeRepository;
        this.alunoMapper = alunoMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AlunoResponseDTO criar(AlunoRequestDTO dto) {
        Aluno aluno = alunoMapper.toEntity(dto);
        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            aluno.setEndereco(endereco);
        }

        if (dto.getFaculdade() != null && dto.getFaculdade().getId() != null) {
            Faculdade faculdade = faculdadeRepository.findById(dto.getFaculdade().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + dto.getFaculdade().getId()));
            aluno.setFaculdade(faculdade);
        }

        Aluno salvo = alunoRepository.save(aluno);
        return alunoMapper.toResponse(salvo);
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + id));
        return alunoMapper.toResponse(aluno);
    }

    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(alunoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + id));

        alunoMapper.updateEntity(aluno, dto);
        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));

        if (dto.getEndereco() != null && dto.getEndereco().getId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEndereco().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + dto.getEndereco().getId()));
            aluno.setEndereco(endereco);
        }

        if (dto.getFaculdade() != null && dto.getFaculdade().getId() != null) {
            Faculdade faculdade = faculdadeRepository.findById(dto.getFaculdade().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + dto.getFaculdade().getId()));
            aluno.setFaculdade(faculdade);
        }

        Aluno atualizado = alunoRepository.save(aluno);
        return alunoMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Aluno aluno = alunoRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + id));
        alunoRepository.delete(aluno);
    }
}
