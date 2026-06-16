package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record NotificacaoResponseDTO(
        Long id,
        Long alunoId,
        Long viagemId,
        String tipoNotificacao,
        String mensagem,
        LocalDateTime dataHoraEnvio,
        Boolean lida
) {
}
