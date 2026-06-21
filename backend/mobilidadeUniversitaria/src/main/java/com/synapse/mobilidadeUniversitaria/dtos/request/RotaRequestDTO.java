package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record RotaRequestDTO(

        @NotBlank(message = "Nome da rota é necessário")
        String nomeRota,

        @NotBlank(message = "Descrição é obrigatória")
        String descricao,

        @NotBlank(message = "ponto de parada é obrigatório")
        String pontoParada,

        String paradas  // JSON string: "[\"Av. Principal\",\"Shopping\"]"
) {
}
