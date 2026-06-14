package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Usuario;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import org.springframework.stereotype.Component;

@Component
public abstract class UsuarioMapper {

    protected final EnderecoMapper enderecoMapper;

    protected UsuarioMapper(EnderecoMapper enderecoMapper) {
        this.enderecoMapper = enderecoMapper;
    }

    protected void updateCommon(Usuario entidade, UsuarioRequestDTO dto) {
        if (entidade == null || dto == null) return;
        entidade.setNome(dto.getNome());
        entidade.setEmail(dto.getEmail());
        entidade.setCpf(dto.getCpf());
        entidade.setTelefone(dto.getTelefone());

    }

    protected void commonResponse(UsuarioResponseDTO dto, Usuario entidade) {

        if (entidade == null || dto == null) return;

        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmail(entidade.getEmail());
        dto.setCpf(entidade.getCpf());
        dto.setTipoUsuario(entidade.getUserType());
        dto.setTelefone(entidade.getTelefone());
        dto.setEndereco(enderecoMapper.toResponse(entidade.getEndereco()));


    }


}
