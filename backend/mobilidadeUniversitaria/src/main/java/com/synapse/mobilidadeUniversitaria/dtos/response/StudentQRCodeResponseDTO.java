package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record StudentQRCodeResponseDTO(
        String qrData,
        LocalDateTime expiresAt,
        Long alunoId
) {
}
