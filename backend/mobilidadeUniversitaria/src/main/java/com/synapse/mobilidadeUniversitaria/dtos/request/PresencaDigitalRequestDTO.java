package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PresencaDigitalRequestDTO(

        @NotNull(message = "Viagem e obrigatoria")
        @Positive(message = "Viagem deve ser um id positivo")
        Long viagemId
) {
}
