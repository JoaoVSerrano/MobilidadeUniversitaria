package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.dtos.request.StudentRegistrationRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentRegistrationService {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public void createStudentRequest(StudentRegistrationRequestDTO dto) {
        // Verifica se a tabela STUDENT_REGISTRATION_REQUEST existe
        try {
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM STUDENT_REGISTRATION_REQUEST", Integer.class);
        } catch (Exception e) {
            // Tenta criar a tabela se não existir
            try {
                jdbcTemplate.update(
                    "CREATE TABLE STUDENT_REGISTRATION_REQUEST (" +
                    "ID BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                    "NOME VARCHAR(255) NOT NULL, " +
                    "EMAIL VARCHAR(255) NOT NULL UNIQUE, " +
                    "CPF VARCHAR(11) NOT NULL UNIQUE, " +
                    "SENHA VARCHAR(255) NOT NULL, " +
                    "TELEFONE VARCHAR(20) NOT NULL, " +
                    "ENDERECO_ID BIGINT NOT NULL, " +
                    "STATUS VARCHAR(20) NOT NULL DEFAULT 'PENDING', " +
                    "CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                    "FOREIGN KEY (ENDERECO_ID) REFERENCES ENDERECO(ID))"
                );
            } catch (Exception ex) {
                throw new RuntimeException("Erro ao criar tabela STUDENT_REGISTRATION_REQUEST: " + ex.getMessage());
            }
        }

        // Verifica se email ou CPF já existem
        Integer countEmail = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM USUARIO WHERE EMAIL = ?", Integer.class, dto.email());
        if (countEmail != null && countEmail > 0) {
            throw new RuntimeException("Email ja cadastrado");
        }

        Integer countCpf = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM USUARIO WHERE CPF = ?", Integer.class, dto.cpf());
        if (countCpf != null && countCpf > 0) {
            throw new RuntimeException("CPF ja cadastrado");
        }

        // Verifica se já existe solicitação pendente
        Integer countRequest = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM STUDENT_REGISTRATION_REQUEST WHERE EMAIL = ? AND STATUS = 'PENDING'",
            Integer.class, dto.email());
        if (countRequest != null && countRequest > 0) {
            throw new RuntimeException("Ja existe uma solicitacao pendente para este email");
        }

        // Busca ou cria endereço
        Long enderecoId;
        try {
            // Tenta usar endereço existente com ID 1
            Integer enderecoCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM ENDERECO WHERE ID = ?", Integer.class, 1L);
            if (enderecoCount != null && enderecoCount > 0) {
                enderecoId = 1L;
            } else {
                // Cria novo endereço
                jdbcTemplate.update(
                    "INSERT INTO ENDERECO (CEP, RUA, BAIRRO, NUMERO, TIPO_LOCAL) VALUES (?, ?, ?, ?, ?)",
                    dto.cep() != null ? dto.cep() : "00000-000",
                    dto.rua() != null ? dto.rua() : "Nao informada",
                    dto.bairro() != null ? dto.bairro() : "Nao informado",
                    dto.numero() != null ? dto.numero() : "0",
                    dto.tipoLocal() != null ? dto.tipoLocal() : "RESIDENCIAL"
                );
                // Busca o ID do endereço criado
                enderecoId = jdbcTemplate.queryForObject("SELECT MAX(ID) FROM ENDERECO", Long.class);
                if (enderecoId == null) enderecoId = 1L;
            }
        } catch (Exception e) {
            // Se falhar, cria novo endereço
            jdbcTemplate.update(
                "INSERT INTO ENDERECO (CEP, RUA, BAIRRO, NUMERO, TIPO_LOCAL) VALUES (?, ?, ?, ?, ?)",
                dto.cep() != null ? dto.cep() : "00000-000",
                dto.rua() != null ? dto.rua() : "Nao informada",
                dto.bairro() != null ? dto.bairro() : "Nao informado",
                dto.numero() != null ? dto.numero() : "0",
                dto.tipoLocal() != null ? dto.tipoLocal() : "RESIDENCIAL"
            );
            enderecoId = jdbcTemplate.queryForObject("SELECT MAX(ID) FROM ENDERECO", Long.class);
            if (enderecoId == null) enderecoId = 1L;
        }

        // Insere solicitação de cadastro
        jdbcTemplate.update(
            "INSERT INTO STUDENT_REGISTRATION_REQUEST (NOME, EMAIL, CPF, SENHA, TELEFONE, ENDERECO_ID, STATUS, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)",
            dto.nome(), dto.email(), dto.cpf(), dto.senha(), dto.telefone(), enderecoId
        );
    }

    public List<StudentRegistrationRequest> listPendingRequests() {
        return jdbcTemplate.query(
            "SELECT * FROM STUDENT_REGISTRATION_REQUEST WHERE STATUS = 'PENDING' ORDER BY CREATED_AT DESC",
            new StudentRegistrationRequestRowMapper()
        );
    }

    public UsuarioResponseDTO approveStudentRequest(Long requestId) {
        // Busca a solicitação
        StudentRegistrationRequest request = jdbcTemplate.queryForObject(
            "SELECT * FROM STUDENT_REGISTRATION_REQUEST WHERE ID = ? AND STATUS = 'PENDING'",
            new StudentRegistrationRequestRowMapper(), requestId);

        if (request == null) {
            throw new RuntimeException("Solicitacao nao encontrada ou ja processada");
        }

        // Cria o usuário
        String senhaHash = passwordEncoder.encode(request.senha());
        
        // Busca próximo ID disponível
        Long nextId = jdbcTemplate.queryForObject("SELECT MAX(ID) FROM USUARIO", Long.class);
        if (nextId == null) nextId = 0L;
        nextId = nextId + 1;

        jdbcTemplate.update(
            "INSERT INTO USUARIO (ID, NOME, EMAIL, SENHA, CPF, TELEFONE, USER_TYPE, ENDERECO_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            nextId, request.nome(), request.email(), senhaHash, request.cpf(), request.telefone(), "ALUNO", request.enderecoId()
        );

        jdbcTemplate.update(
            "INSERT INTO ALUNO (ID, STATUS_MATRICULA, FOTO_PERFIL, FACULDADE_ID) VALUES (?, ?, ?, ?)",
            nextId, "ATIVA", null, null
        );

        // Atualiza status da solicitação
        jdbcTemplate.update(
            "UPDATE STUDENT_REGISTRATION_REQUEST SET STATUS = 'APPROVED', UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ?",
            requestId
        );

        // Busca o usuário criado
        UsuarioResponseDTO usuario = jdbcTemplate.queryForObject(
            "SELECT ID, NOME, EMAIL, CPF, TELEFONE, USER_TYPE FROM USUARIO WHERE EMAIL = ?",
            new UsuarioRowMapper(),
            request.email()
        );

        return usuario;
    }

    public void rejectStudentRequest(Long requestId) {
        Integer updated = jdbcTemplate.update(
            "UPDATE STUDENT_REGISTRATION_REQUEST SET STATUS = 'REJECTED', UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ? AND STATUS = 'PENDING'",
            requestId
        );
        if (updated == 0) {
            throw new RuntimeException("Solicitacao nao encontrada ou ja processada");
        }
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
        String createdAt
    ) {}

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
                rs.getString("CREATED_AT")
            );
        }
    }

    private static class UsuarioRowMapper implements RowMapper<UsuarioResponseDTO> {
        @Override
        public UsuarioResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            UsuarioResponseDTO dto = new UsuarioResponseDTO();
            dto.setId(rs.getLong("ID"));
            dto.setNome(rs.getString("NOME"));
            dto.setEmail(rs.getString("EMAIL"));
            dto.setCpf(rs.getString("CPF"));
            dto.setTelefone(rs.getString("TELEFONE"));
            dto.setTipoUsuario(com.synapse.mobilidadeUniversitaria.Entities.enums.UserType.valueOf(rs.getString("USER_TYPE")));
            return dto;
        }
    }
}
