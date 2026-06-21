package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

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
        Integer capacidadeTotal,

        @NotNull(message = "Ano e obrigatorio")
        @Positive(message = "Ano deve ser positivo")
        Integer ano,

        @NotBlank(message = "Status e obrigatorio")
        @Pattern(regexp = "^(ATIVO|INATIVO|MANUTENCAO)$", message = "Status invalido. Valores aceitos: ATIVO, INATIVO, MANUTENCAO")
        String status,

        @NotNull(message = "Km rodados e obrigatorio")
        @PositiveOrZero(message = "Km rodados nao pode ser negativo")
        Integer kmRodados
) {
}
