package com.synapse.mobilidadeUniversitaria.dtos.response;

public record VeiculoResponseDTO(
        Long id,
        String placa,
        String modelo,
        int capacidadeTotal,
        Integer ano,
        String status,
        Integer kmRodados,
        String proximaRevisao
) {
}
