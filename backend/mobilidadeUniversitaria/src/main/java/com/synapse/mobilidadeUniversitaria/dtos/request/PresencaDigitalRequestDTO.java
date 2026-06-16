package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotNull;

public record PresencaDigitalRequestDTO(

        @NotNull(message = "Viagem é obrigatória")
        Long viagemId

        // alunoId vai ser pego pelo JWT, entao ver como fazer isso



) {
}
