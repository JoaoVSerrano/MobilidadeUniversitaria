package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record PresencaFisicaResponseDTO(
        Long id,
        Long alunoId,
        String alunoNome,
        Boolean embarcado,
        LocalDateTime confirmadoEm
) {
}
