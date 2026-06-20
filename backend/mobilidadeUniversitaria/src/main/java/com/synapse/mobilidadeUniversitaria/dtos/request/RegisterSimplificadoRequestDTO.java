package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterSimplificadoRequestDTO(
        @NotBlank(message = "Nome e obrigatorio")
        String nome,

        @NotBlank(message = "Email e obrigatorio")
        @Email(message = "Email invalido")
        String email,

        @NotBlank(message = "CPF e obrigatorio")
        @Pattern(regexp = "^\\d{11}$", message = "CPF deve conter 11 digitos")
        String cpf,

        @NotBlank(message = "Senha e obrigatoria")
        String senha,

        @NotBlank(message = "Telefone e obrigatorio")
        @Pattern(regexp = "^\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}$", message = "Telefone invalido")
        String telefone,

        String tipoUsuario
) {
}