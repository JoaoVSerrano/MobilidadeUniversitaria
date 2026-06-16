package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record EnderecoRequestDTO(

        @NotBlank(message = "Insira o CEP")
        String cep,

        @NotBlank(message = "Rua necessária")
        String rua,

        @NotBlank(message = "bairro necessário")
        String bairro,

        @NotBlank(message = "insira o numero")
        String numero,

        String complemento,

        LocalType tipoLocal
) {

}
