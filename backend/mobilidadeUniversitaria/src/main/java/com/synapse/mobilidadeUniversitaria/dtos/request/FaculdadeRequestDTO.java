package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FaculdadeRequestDTO(

        @NotBlank(message = "Nome da faculdade e obrigatorio")
        String nome,

        @NotNull(message = "Endereco e obrigatorio")
        @Positive(message = "Endereco deve ser um id positivo")
        Long enderecoId
) {
}
