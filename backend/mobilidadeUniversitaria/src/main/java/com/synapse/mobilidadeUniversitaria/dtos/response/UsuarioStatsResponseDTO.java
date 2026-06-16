package com.synapse.mobilidadeUniversitaria.dtos.response;

public record UsuarioStatsResponseDTO(
        long totalUsuarios,
        long totalAlunos,
        long totalMotoristas,
        long totalGestores
) {
}
