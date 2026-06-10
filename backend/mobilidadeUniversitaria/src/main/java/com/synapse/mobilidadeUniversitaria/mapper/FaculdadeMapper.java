package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import com.synapse.mobilidadeUniversitaria.dtos.response.FaculdadeResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FaculdadeMapper {

    private final EnderecoMapper enderecoMapper;

    public FaculdadeResponseDTO toResponse(Faculdade faculdade) {
        if (faculdade == null) return null;

        return new FaculdadeResponseDTO(
                faculdade.getId(),
                faculdade.getNome(),
                enderecoMapper.toResponse(faculdade.getEndereco()),
                faculdade.getDataHoraValidacao()
        );
    }
}
