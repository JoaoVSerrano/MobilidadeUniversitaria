package com.synapse.mobilidadeUniversitaria.dtos.response;

public record VeiculoResponseDTO(
        Long id,
        String placa,
        String modelo,
        int capacidadeTotal
) {
}
