package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record FaculdadeResponseDTO(
        Long id,
        String nome,
        EnderecoResponseDTO endereco,
        LocalDateTime dataHoraValidacao
) {
}
