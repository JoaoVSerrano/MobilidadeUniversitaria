package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.StudentRegistrationRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.AlunoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.FaculdadeRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class StudentRegistrationService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final AlunoService alunoService;

    // Armazenamento em memória das solicitações pendentes
    private final Map<Long, StudentRegistrationRequestDTO> pendingRequests = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1L);

    public void createStudentRequest(StudentRegistrationRequestDTO dto) {
        // Verificar duplicidade de email e CPF no banco de usuários ativos
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado: " + dto.email());
        }
        if (usuarioRepository.existsByCpf(dto.cpf())) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado: " + dto.cpf());
        }
        // Verificar solicitação já pendente em memória
        boolean jaExiste = pendingRequests.values().stream()
                .anyMatch(r -> r.email().equals(dto.email()) || r.cpf().equals(dto.cpf()));
        if (jaExiste) {
            throw new ResourceAlreadyExistsException("Ja existe uma solicitacao pendente para este email ou CPF");
        }

        long id = idCounter.getAndIncrement();
        pendingRequests.put(id, dto);
    }

    public List<Map<String, Object>> listPendingRequests() {
        List<Map<String, Object>> result = new ArrayList<>();
        pendingRequests.forEach((id, dto) -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", id);
            map.put("nome", dto.nome());
            map.put("email", dto.email());
            map.put("cpf", dto.cpf());
            map.put("telefone", dto.telefone());
            map.put("nomeFaculdade", dto.nomeFaculdade());
            map.put("cep", dto.cep());
            map.put("rua", dto.rua());
            map.put("bairro", dto.bairro());
            map.put("numero", dto.numero());
            map.put("complemento", dto.complemento());
            map.put("tipoLocal", dto.tipoLocal());
            map.put("status", "PENDING");
            map.put("createdAt", LocalDate.now().toString());
            result.add(map);
        });
        return result;
    }

    @org.springframework.transaction.annotation.Transactional
    public UsuarioResponseDTO approveStudentRequest(Long id) {
        StudentRegistrationRequestDTO dto = pendingRequests.get(id);
        if (dto == null) {
            throw new ResourceNotFoundException("Solicitacao nao encontrada: " + id);
        }

        // Criar ou buscar endereço
        Endereco endereco = enderecoRepository.findById(1L).orElseGet(() -> {
            Endereco novo = new Endereco();
            novo.setCep(dto.cep() != null && !dto.cep().isBlank() ? dto.cep().replaceAll("\\D", "") : "00000000");
            novo.setRua(dto.rua() != null && !dto.rua().isBlank() ? dto.rua() : "Nao informada");
            novo.setBairro(dto.bairro() != null && !dto.bairro().isBlank() ? dto.bairro() : "Nao informado");
            novo.setNumero(dto.numero() != null && !dto.numero().isBlank() ? dto.numero() : "0");
            novo.setTipoLocal(LocalType.RESIDENCIAL);
            return enderecoRepository.save(novo);
        });

        // Buscar ou criar faculdade com base no nome fornecido pelo aluno
        Long faculdadeId;
        if (dto.nomeFaculdade() != null && !dto.nomeFaculdade().isBlank()) {
            // Buscar faculdade pelo nome
            faculdadeId = faculdadeRepository.findByNome(dto.nomeFaculdade())
                    .map(f -> f.getId())
                    .orElseGet(() -> {
                        // Criar nova faculdade com o nome fornecido
                        com.synapse.mobilidadeUniversitaria.Entities.Faculdade faculdade = new com.synapse.mobilidadeUniversitaria.Entities.Faculdade();
                        faculdade.setNome(dto.nomeFaculdade());
                        faculdade.setEndereco(endereco);
                        com.synapse.mobilidadeUniversitaria.Entities.Faculdade salva = faculdadeRepository.save(faculdade);
                        return salva.getId();
                    });
        } else {
            // Fallback: buscar primeira faculdade disponível ou criar padrão
            faculdadeId = faculdadeRepository.findAll().stream()
                    .findFirst()
                    .map(f -> f.getId())
                    .orElseGet(() -> {
                        com.synapse.mobilidadeUniversitaria.Entities.Faculdade faculdade = new com.synapse.mobilidadeUniversitaria.Entities.Faculdade();
                        faculdade.setNome("Faculdade Padrão");
                        faculdade.setEndereco(endereco);
                        com.synapse.mobilidadeUniversitaria.Entities.Faculdade salva = faculdadeRepository.save(faculdade);
                        return salva.getId();
                    });
        }

        // Criar aluno via AlunoService (usa JPA corretamente, com bcrypt na senha)
        AlunoRequestDTO alunoRequest = new AlunoRequestDTO();
        alunoRequest.setNome(dto.nome());
        alunoRequest.setEmail(dto.email());
        alunoRequest.setCpf(dto.cpf());
        alunoRequest.setSenha(dto.senha());
        alunoRequest.setTelefone(dto.telefone());
        alunoRequest.setEnderecoId(endereco.getId());
        alunoRequest.setFaculdadeId(faculdadeId);
        alunoRequest.setStatusMatricula(
                com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula.ATIVA);

        AlunoResponseDTO aluno = alunoService.criar(alunoRequest);

        // Remover da fila de pendentes
        pendingRequests.remove(id);

        // Converter AlunoResponseDTO em UsuarioResponseDTO para retornar
        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(aluno.getId());
        response.setNome(aluno.getNome());
        response.setEmail(aluno.getEmail());
        response.setCpf(aluno.getCpf());
        response.setTelefone(aluno.getTelefone());
        response.setTipoUsuario(com.synapse.mobilidadeUniversitaria.Entities.enums.UserType.ALUNO);
        return response;
    }

    public void rejectStudentRequest(Long id) {
        if (!pendingRequests.containsKey(id)) {
            throw new ResourceNotFoundException("Solicitacao nao encontrada: " + id);
        }
        pendingRequests.remove(id);
    }
}
