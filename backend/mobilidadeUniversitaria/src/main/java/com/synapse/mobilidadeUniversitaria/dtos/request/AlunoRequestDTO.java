package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlunoRequestDTO extends UsuarioRequestDTO {

    @NotNull(message = "Faculdade e obrigatoria")
    @Positive(message = "Faculdade deve ser um id positivo")
    private Long faculdadeId;

    @NotNull(message = "Status da matricula e obrigatorio")
    private StatusMatricula statusMatricula;
}
