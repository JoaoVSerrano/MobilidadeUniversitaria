package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record AlunoFrequenciaResponseDTO(
        Long alunoId,
        String nome,
        long viagensReservadas,
        long viagensConfirmadas,
        double percentualFrequencia,
        LocalDateTime createdAt
) {}
