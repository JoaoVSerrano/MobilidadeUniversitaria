package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MotoristaRequestDTO extends UsuarioRequestDTO {

    @NotBlank(message = "Numero da CNH e obrigatorio")
    private String cnhNumero;

    @NotNull(message = "Data de vencimento da CNH e obrigatoria")
    @Future(message = "Vencimento da CNH deve ser uma data futura")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate vencimentoCnh;
}
