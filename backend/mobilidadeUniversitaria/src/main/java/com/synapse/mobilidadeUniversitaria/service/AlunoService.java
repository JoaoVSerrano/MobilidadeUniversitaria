package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.AlunoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.AlunoMapper;
import com.synapse.mobilidadeUniversitaria.mapper.ViagemMapper;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.FaculdadeRepository;
import com.synapse.mobilidadeUniversitaria.repositories.PresencaDigitalRepository;
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
    private final UsuarioValidationService usuarioValidationService;
    private final PresencaDigitalRepository presencaRepository;
    private final ViagemMapper viagemMapper;

    public AlunoService(AlunoRepository alunoRepository,
                        EnderecoRepository enderecoRepository,
                        FaculdadeRepository faculdadeRepository,
                        AlunoMapper alunoMapper,
                        PasswordEncoder passwordEncoder,
                        UsuarioValidationService usuarioValidationService,
                        PresencaDigitalRepository presencaRepository,
                        ViagemMapper viagemMapper) {
        this.alunoRepository = alunoRepository;
        this.enderecoRepository = enderecoRepository;
        this.faculdadeRepository = faculdadeRepository;
        this.alunoMapper = alunoMapper;
        this.passwordEncoder = passwordEncoder;
        this.usuarioValidationService = usuarioValidationService;
        this.presencaRepository = presencaRepository;
        this.viagemMapper = viagemMapper;
    }

    public AlunoResponseDTO criar(AlunoRequestDTO dto) {
        usuarioValidationService.validarCriacao(dto);

        Aluno aluno = alunoMapper.toEntity(dto);
        aluno.setUserType(UserType.ALUNO);
        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));
        aluno.setEndereco(buscarEndereco(dto.getEnderecoId()));
        aluno.setFaculdade(buscarFaculdade(dto.getFaculdadeId()));

        Aluno salvo = alunoRepository.save(aluno);
        return alunoMapper.toResponse(salvo);
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = buscarAlunoPorId(id);
        return alunoMapper.toResponse(aluno);
    }

    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(alunoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AlunoResponseDTO atualizar(Long id, AlunoUpdateRequestDTO dto) {
        Aluno aluno = buscarAlunoPorId(id);
        usuarioValidationService.validarAtualizacao(aluno.getId(), dto);

        alunoMapper.updateEntity(aluno, dto);
        aluno.setUserType(UserType.ALUNO);
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            aluno.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        aluno.setEndereco(buscarEndereco(dto.getEnderecoId()));
        aluno.setFaculdade(buscarFaculdade(dto.getFaculdadeId()));

        Aluno atualizado = alunoRepository.save(aluno);
        return alunoMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        Aluno aluno = buscarAlunoPorId(id);
        alunoRepository.delete(aluno);
    }

    public List<ViagemResponseDTO> listarViagens(Long alunoId) {
        buscarAlunoPorId(alunoId);
        return presencaRepository.findByAlunoId(alunoId)
                .stream()
                .map(presenca -> viagemMapper.toResponse(presenca.getViagem()))
                .toList();
    }

    public List<PresencaDigitalResponseDTO> listarPresencas(Long alunoId) {
        buscarAlunoPorId(alunoId);
        return presencaRepository.findByAlunoId(alunoId)
                .stream()
                .map(presenca -> new PresencaDigitalResponseDTO(
                        presenca.getId(),
                        presenca.getAluno().getId(),
                        presenca.getAluno().getNome(),
                        presenca.getViagem().getId(),
                        presenca.getDataHoraReserva(),
                        presenca.getDataHoraValidacao(),
                        presenca.getStatus()
                ))
                .toList();
    }

    private Aluno buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + id));
    }

    private Endereco buscarEndereco(Long enderecoId) {
        return enderecoRepository.findById(enderecoId)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco nao encontrado com id: " + enderecoId));
    }

    private Faculdade buscarFaculdade(Long faculdadeId) {
        return faculdadeRepository.findById(faculdadeId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculdade nao encontrada com id: " + faculdadeId));
    }
}
