package com.synapse.mobilidadeUniversitaria.dtos.response;

public record OcupacaoViagemResponseDTO(
        Long viagemId,
        int capacidadeTotal,
        long reservas,
        long confirmados,
        double percentualOcupacao
) {
}
