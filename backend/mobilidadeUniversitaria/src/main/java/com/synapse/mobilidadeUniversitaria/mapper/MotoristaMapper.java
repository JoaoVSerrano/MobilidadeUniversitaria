package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.MotoristaResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class MotoristaMapper extends UsuarioMapper {

    public MotoristaMapper(EnderecoMapper enderecoMapper) {
        super(enderecoMapper);
    }

    public Motorista toEntity(MotoristaRequestDTO dto) {
        if (dto == null) return null;

        Motorista motorista = new Motorista();
        updateCommon(motorista, dto);
        motorista.setCnhNumero(dto.getCnhNumero());
        motorista.setVencimentoCnh(dto.getVencimentoCnh());
        return motorista;
    }

    public void updateEntity(Motorista motorista, MotoristaRequestDTO dto) {
        if (motorista == null || dto == null) return;

        updateCommon(motorista, dto);
        motorista.setCnhNumero(dto.getCnhNumero());
        motorista.setVencimentoCnh(dto.getVencimentoCnh());
    }

    public void updateEntity(Motorista motorista, MotoristaUpdateRequestDTO dto) {
        if (motorista == null || dto == null) return;

        updateCommon(motorista, dto);
        motorista.setCnhNumero(dto.getCnhNumero());
        motorista.setVencimentoCnh(dto.getVencimentoCnh());
    }

    public MotoristaResponseDTO toResponse(Motorista motorista) {
        if (motorista == null) return null;

        MotoristaResponseDTO dto = new MotoristaResponseDTO();
        commonResponse(dto, motorista);
        dto.setCnhNumero(motorista.getCnhNumero());
        dto.setVencimentoCnh(motorista.getVencimentoCnh());
        return dto;
    }
}
