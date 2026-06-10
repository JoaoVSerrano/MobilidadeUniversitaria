package com.synapse.mobilidadeUniversitaria.dtos.response;


import lombok.*;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MotoristaResponseDTO extends UsuarioResponseDTO {

    private String cnhNumero;
    private LocalDate vencimentoCnh;
}
