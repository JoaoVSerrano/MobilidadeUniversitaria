package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus;

import java.time.LocalDateTime;

public record PresencaDigitalResponseDTO(
        Long id,
        Long alunoId,
        String alunoNome,
        Long viagemId,
        LocalDateTime dataHoraReserva,
        LocalDateTime dataHoraValidacao,
        PresencaStatus status
) {
}
