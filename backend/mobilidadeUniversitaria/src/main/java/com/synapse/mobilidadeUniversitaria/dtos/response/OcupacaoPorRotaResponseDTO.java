package com.synapse.mobilidadeUniversitaria.dtos.response;

public record OcupacaoPorRotaResponseDTO(
        Long rotaId,
        String nomeRota,
        long totalPresencas,
        int capacidadeTotal,
        double ocupacaoPercent
) {
}
