package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlunoRequestDTO extends UsuarioRequestDTO {

    @NotBlank(message = "Faculdade é obrigatório")
    private Faculdade faculdade;

    @NotBlank(message = "status da matricula é necessário")
    private String statusMatricula;
}
