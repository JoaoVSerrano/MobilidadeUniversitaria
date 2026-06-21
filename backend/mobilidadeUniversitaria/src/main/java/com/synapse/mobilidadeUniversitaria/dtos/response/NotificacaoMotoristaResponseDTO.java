package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record NotificacaoMotoristaResponseDTO(
        Long id,
        Long motoristaId,
        Long viagemId,
        String tipoNotificacao,
        String mensagem,
        LocalDateTime dataHoraEnvio,
        Boolean lida,
        String acao,
        String acaoUrl
) {}
