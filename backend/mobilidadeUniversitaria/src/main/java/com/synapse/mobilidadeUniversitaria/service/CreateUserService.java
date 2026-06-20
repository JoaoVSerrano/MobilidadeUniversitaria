package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterSimplificadoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.mapper.EnderecoMapper;
import com.synapse.mobilidadeUniversitaria.repositories.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;

@Service
@RequiredArgsConstructor
public class CreateUserService {

    private final JdbcTemplate jdbcTemplate;
    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;

    public UsuarioResponseDTO criar(RegisterSimplificadoRequestDTO dto) {
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

        // Busca ou cria endereço padrão
        Long enderecoId = 1L;
        if (!enderecoRepository.existsById(1L)) {
            jdbcTemplate.update(
                "INSERT INTO ENDERECO (CEP, RUA, BAIRRO, NUMERO, TIPO_LOCAL) VALUES (?, ?, ?, ?, ?)",
                "00000-000", "Não informada", "Não informado", "0", "RESIDENCIAL"
            );
        }

        // Determina o tipo de usuário
        String tipoUsuario = dto.tipoUsuario() != null ? dto.tipoUsuario().toUpperCase() : "ALUNO";

        // Gera a senha hash simples (vai ser recriada no próximo login se necessário)
        String senhaHash = "$2a$10$tp9lNfP7st0/lgTBSZdeLeTdKAU94yYM55drvghWMSXnnnZSwHHSG"; // "password123"

        // Busca próximo ID disponível
        Long nextId = jdbcTemplate.queryForObject("SELECT MAX(ID) FROM USUARIO", Long.class);
        if (nextId == null) nextId = 0L;
        nextId = nextId + 1;

        // INSERT direto na tabela COM ID explícito
        jdbcTemplate.update(
            "INSERT INTO USUARIO (ID, NOME, EMAIL, SENHA, CPF, TELEFONE, USER_TYPE, ENDERECO_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            nextId, dto.nome(), dto.email(), senhaHash, dto.cpf(), dto.telefone(), tipoUsuario, enderecoId
        );

        // Busca o usuário criado
        UsuarioResponseDTO usuario = jdbcTemplate.queryForObject(
            "SELECT ID, NOME, EMAIL, CPF, TELEFONE, USER_TYPE FROM USUARIO WHERE EMAIL = ?",
            new UsuarioRowMapper(),
            dto.email()
        );

        return usuario;
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