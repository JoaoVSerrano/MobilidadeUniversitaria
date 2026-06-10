package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record PresencaDigitalResponseDTO(
        Long id,
        Long alunoId,
        String alunoNome,
        Long viagemId,
        LocalDateTime dataHoraValidacao
) {
}
