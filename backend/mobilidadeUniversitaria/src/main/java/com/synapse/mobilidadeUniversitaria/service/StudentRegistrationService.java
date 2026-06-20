package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;
import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.request.StudentRegistrationRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentRegistrationService {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final AlunoRepository alunoRepository;

    @Transactional
    public void createStudentRequest(StudentRegistrationRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResourceAlreadyExistsException("Email ja cadastrado: " + dto.email());
        }
        if (usuarioRepository.existsByCpf(dto.cpf())) {
            throw new ResourceAlreadyExistsException("CPF ja cadastrado: " + dto.cpf());
        }
        if (existsPendingRequest(dto.email(), dto.cpf())) {
            throw new ResourceAlreadyExistsException("Ja existe uma solicitacao pendente para este email ou CPF");
        }

        Endereco endereco = new Endereco();
        endereco.setCep(defaultString(dto.cep(), "00000-000"));
        endereco.setRua(defaultString(dto.rua(), "Nao informada"));
        endereco.setBairro(defaultString(dto.bairro(), "Nao informado"));
        endereco.setNumero(defaultString(dto.numero(), "0"));
        endereco.setComplemento(dto.complemento());
        endereco.setTipoLocal(parseLocalType(dto.tipoLocal()));

        Endereco savedEndereco = enderecoRepository.save(endereco);

        jdbcTemplate.update(
                "INSERT INTO STUDENT_REGISTRATION_REQUEST " +
                        "(NOME, EMAIL, CPF, SENHA, TELEFONE, ENDERECO_ID, STATUS, CREATED_AT, UPDATED_AT) " +
                        "VALUES (?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                dto.nome(),
                dto.email(),
                dto.cpf(),
                dto.senha(),
                dto.telefone(),
                savedEndereco.getId()
        );
    }

    public List<StudentRegistrationRequest> listPendingRequests() {
        return jdbcTemplate.query(
                "SELECT * FROM STUDENT_REGISTRATION_REQUEST WHERE STATUS = 'PENDING' ORDER BY CREATED_AT DESC",
                new StudentRegistrationRequestRowMapper()
        );
    }

    @Transactional
    public UsuarioResponseDTO approveStudentRequest(Long requestId) {
        StudentRegistrationRequest request = jdbcTemplate.query(
                        "SELECT * FROM STUDENT_REGISTRATION_REQUEST WHERE ID = ? AND STATUS = 'PENDING'",
                        new StudentRegistrationRequestRowMapper(),
                        requestId
                )
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Solicitacao nao encontrada ou ja processada: " + requestId
                ));

        Endereco endereco = enderecoRepository.findById(request.enderecoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Endereco nao encontrado com id: " + request.enderecoId()
                ));

        Aluno aluno = new Aluno();
        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setCpf(request.cpf());
        aluno.setSenha(passwordEncoder.encode(request.senha()));
        aluno.setTelefone(request.telefone());
        aluno.setUserType(UserType.ALUNO);
        aluno.setEndereco(endereco);
        aluno.setStatusMatricula(StatusMatricula.ATIVA);

        Aluno salvo = alunoRepository.save(aluno);

        jdbcTemplate.update(
                "UPDATE STUDENT_REGISTRATION_REQUEST SET STATUS = 'APPROVED', UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ?",
                requestId
        );

        return toUsuarioResponse(salvo);
    }

    @Transactional
    public void rejectStudentRequest(Long requestId) {
        Integer updated = jdbcTemplate.update(
                "UPDATE STUDENT_REGISTRATION_REQUEST SET STATUS = 'REJECTED', UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ? AND STATUS = 'PENDING'",
                requestId
        );
        if (updated == 0) {
            throw new ResourceNotFoundException("Solicitacao nao encontrada ou ja processada: " + requestId);
        }
    }

    private boolean existsPendingRequest(String email, String cpf) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM STUDENT_REGISTRATION_REQUEST WHERE STATUS = 'PENDING' AND (EMAIL = ? OR CPF = ?)",
                Integer.class,
                email,
                cpf
        );
        return count != null && count > 0;
    }

    private String defaultString(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value.trim();
    }

    private LocalType parseLocalType(String value) {
        if (value == null || value.isBlank()) {
            return LocalType.RESIDENCIAL;
        }
        return LocalType.valueOf(value.trim().toUpperCase());
    }

    private UsuarioResponseDTO toUsuarioResponse(Aluno aluno) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(aluno.getId());
        dto.setNome(aluno.getNome());
        dto.setEmail(aluno.getEmail());
        dto.setCpf(aluno.getCpf());
        dto.setTelefone(aluno.getTelefone());
        dto.setTipoUsuario(UserType.ALUNO);
        return dto;
    }

    private record StudentRegistrationRequest(
            Long id,
            String nome,
            String email,
            String cpf,
            String senha,
            String telefone,
            Long enderecoId,
            String status,
            LocalDateTime createdAt
    ) {
    }

    private static class StudentRegistrationRequestRowMapper implements RowMapper<StudentRegistrationRequest> {
        @Override
        public StudentRegistrationRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StudentRegistrationRequest(
                    rs.getLong("ID"),
                    rs.getString("NOME"),
                    rs.getString("EMAIL"),
                    rs.getString("CPF"),
                    rs.getString("SENHA"),
                    rs.getString("TELEFONE"),
                    rs.getLong("ENDERECO_ID"),
                    rs.getString("STATUS"),
                    rs.getTimestamp("CREATED_AT") != null ? rs.getTimestamp("CREATED_AT").toLocalDateTime() : null
            );
        }
    }
}
