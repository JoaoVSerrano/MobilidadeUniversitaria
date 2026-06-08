package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FaculdadeRequestDTO(

    @NotBlank(message = "Nome da faculdade é necessário")
    Long nome,

    @NotNull(message = "endereço é obrigatório")
    Endereco endereco
        ) {
}
