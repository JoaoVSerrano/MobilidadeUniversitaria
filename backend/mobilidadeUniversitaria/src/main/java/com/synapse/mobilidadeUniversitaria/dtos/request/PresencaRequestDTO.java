package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PresencaRequestDTO(
        @NotNull(message = "Aluno e obrigatorio")
        @Positive(message = "Aluno invalido")
        Long alunoId,

        @NotNull(message = "Viagem e obrigatoria")
        @Positive(message = "Viagem invalida")
        Long viagemId
) {
}
