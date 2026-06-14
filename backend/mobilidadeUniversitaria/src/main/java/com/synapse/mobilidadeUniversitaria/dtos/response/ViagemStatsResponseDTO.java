package com.synapse.mobilidadeUniversitaria.dtos.response;

public record ViagemStatsResponseDTO(
        long totalViagens,
        long viagensHoje,
        long proximasViagens
) {
}
