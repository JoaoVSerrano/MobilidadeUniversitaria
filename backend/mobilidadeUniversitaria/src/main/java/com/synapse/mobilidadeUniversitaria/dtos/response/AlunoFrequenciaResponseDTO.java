package com.synapse.mobilidadeUniversitaria.dtos.response;

public record AlunoFrequenciaResponseDTO(
        Long alunoId,
        String nome,
        long viagensReservadas,
        long viagensConfirmadas,
        double percentualFrequencia
) {}
