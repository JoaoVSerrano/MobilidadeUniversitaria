package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record StudentRequestResponseDTO(
        boolean sucesso,
        String mensagem,
        LocalDateTime dataSolicitacao,
        String instrucoes
) {}
