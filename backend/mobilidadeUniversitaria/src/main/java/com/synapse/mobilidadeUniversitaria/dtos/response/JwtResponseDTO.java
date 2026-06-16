package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;

public record JwtResponseDTO(
        String token,
        String tipo,
        Long id,
        String nome,
        String email,
        UserType tipoUsuario
) {
}
