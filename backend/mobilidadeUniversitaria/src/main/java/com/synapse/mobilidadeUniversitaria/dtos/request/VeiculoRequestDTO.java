package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record VeiculoRequestDTO(

        @NotBlank(message = "Placa e obrigatoria")
        @Pattern(
                regexp = "^[A-Z]{3}-?[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$",
                message = "Placa invalida. Formatos aceitos: AAA-1111, AAA1111 ou AAA1A11"
        )
        String placa,

        @NotBlank(message = "Modelo e obrigatorio")
        String modelo,

        @NotNull(message = "Capacidade total e obrigatoria")
        @Positive(message = "Capacidade total deve ser positiva")
        Integer capacidadeTotal
) {
}
