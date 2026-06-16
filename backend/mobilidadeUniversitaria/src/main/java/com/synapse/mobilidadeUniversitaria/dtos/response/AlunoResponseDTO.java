package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoResponseDTO extends UsuarioResponseDTO {

    private FaculdadeResponseDTO faculdade;
    private StatusMatricula statusMatricula;
}
