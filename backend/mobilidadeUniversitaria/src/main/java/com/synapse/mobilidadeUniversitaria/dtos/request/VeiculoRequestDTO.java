package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record VeiculoRequestDTO(

        @Pattern(
                regexp = "^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$",
                message = "Placa inválida. Formatos aceitos: AAA-1111 (antigo) ou AAA1A11 (Mercosul)"
        )
        String placa,

        @NotBlank(message = "informe o modelo do automóvel")
        String modelo,

        @NotNull(message = "Necessário informar a capacidade total de passageiros")
        int capacidadeTotal

) {
}
