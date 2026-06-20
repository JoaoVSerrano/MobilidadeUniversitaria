package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriarUsuarioRequestDTO {

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    private String email;

    @NotBlank(message = "CPF e obrigatorio")
    @Pattern(regexp = "^\\d{11}$", message = "CPF deve conter 11 digitos")
    private String cpf;

    @NotBlank(message = "Telefone e obrigatorio")
    @Pattern(regexp = "^\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}$", message = "Telefone invalido")
    private String telefone;

    @NotBlank(message = "Tipo de usuario e obrigatorio")
    private String tipoUsuario;

    private String senha = "password123";
}