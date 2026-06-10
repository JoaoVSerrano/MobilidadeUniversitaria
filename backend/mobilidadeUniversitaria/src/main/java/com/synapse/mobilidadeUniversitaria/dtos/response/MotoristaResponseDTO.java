package com.synapse.mobilidadeUniversitaria.dtos.response;


import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MotoristaResponseDTO extends UsuarioResponseDTO {

    private String cnhNumero;
    private LocalDate vencimentoCnh;
}
