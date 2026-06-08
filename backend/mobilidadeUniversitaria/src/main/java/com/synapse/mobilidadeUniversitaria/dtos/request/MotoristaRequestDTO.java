package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MotoristaRequestDTO extends UsuarioRequestDTO {

    @NotBlank(message = "numero da CNH obrigatório")
    private String cnhNumero;

    @NotNull(message = "data de vencimento obrigatória")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate vencimentoCnh;


}
