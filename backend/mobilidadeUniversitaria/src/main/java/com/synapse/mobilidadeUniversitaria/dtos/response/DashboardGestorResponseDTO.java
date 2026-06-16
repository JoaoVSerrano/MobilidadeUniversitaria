package com.synapse.mobilidadeUniversitaria.dtos.response;

public record DashboardGestorResponseDTO(
        long totalAlunos,
        double taxaOcupacao,
        long viagensHoje,
        double economiaEstimada
) {
}
