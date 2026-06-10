package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Gestor;
import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.GestorResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class GestorMapper extends UsuarioMapper {

    public GestorMapper(EnderecoMapper enderecoMapper) {
        super(enderecoMapper);
    }

    public Gestor toEntity(UsuarioRequestDTO dto) {
        if (dto == null) return null;

        Gestor gestor = new Gestor();
        updateCommon(gestor, dto);
        return gestor;
    }

    public void updateEntity(Gestor gestor, UsuarioRequestDTO dto) {
        if (gestor == null || dto == null) return;

        updateCommon(gestor, dto);
    }

    public GestorResponseDTO toResponse(Gestor gestor) {
        if (gestor == null) return null;

        GestorResponseDTO dto = new GestorResponseDTO();
        commonResponse(dto, gestor);
        return dto;
    }
}
