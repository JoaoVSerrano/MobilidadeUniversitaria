package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoResponseDTO extends UsuarioResponseDTO {

    private Faculdade faculdade;
    private StatusMatricula statusMatricula;

}
