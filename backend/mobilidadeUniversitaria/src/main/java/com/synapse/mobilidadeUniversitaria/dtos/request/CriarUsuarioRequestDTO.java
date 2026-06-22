package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriarUsuarioRequestDTO implements UsuarioDadosDTO {

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    private String email;

    // Optional for update scenarios - not @NotBlank
    @Pattern(regexp = "^(\\d{11})?$", message = "CPF deve conter 11 digitos se informado")
    private String cpfValue;

    @NotBlank(message = "Telefone e obrigatorio")
    @Pattern(regexp = "^\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}$", message = "Telefone invalido")
    private String telefone;

    // Optional for update scenarios - not @NotBlank
    private String tipoUsuario;

    private String senha = "password123";

    // Lombok @Getter doesn't pick up this field name as "cpf",
    // so we expose it via the interface method
    public void setCpf(String cpf) {
        this.cpfValue = cpf;
    }

    @Override
    public String getCpf() {
        return cpfValue != null ? cpfValue : "";
    }

    @Override
    public Long getEnderecoId() {
        return 1L;
    }
}