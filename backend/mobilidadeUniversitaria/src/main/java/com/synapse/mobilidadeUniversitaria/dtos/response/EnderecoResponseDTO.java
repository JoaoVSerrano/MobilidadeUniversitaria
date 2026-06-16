package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;

import java.time.LocalDateTime;

public record EnderecoResponseDTO(
        Long id,
        String cep,
        String bairro,
        String rua,
        String numero,
        String complemento,
        LocalDateTime dataHoraValidacao,
        LocalType tipoLocal
) {
}
