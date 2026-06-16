package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record NotificacaoAlunoResponseDTO(
        Long id,
        Long notificacaoId,
        Long alunoId,
        boolean lida,
        LocalDateTime lidaEm
) {
}
