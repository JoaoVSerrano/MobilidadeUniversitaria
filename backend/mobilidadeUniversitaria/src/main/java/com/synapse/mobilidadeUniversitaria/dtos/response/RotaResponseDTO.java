package com.synapse.mobilidadeUniversitaria.dtos.response;

public record RotaResponseDTO(
        Long id,
        String nomeRota,
        String descricao,
        String pontoParada,
        String paradas
) {
}
