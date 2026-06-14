package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record QRCodeConfirmacaoRequestDTO(
        @NotNull(message = "Aluno e obrigatorio")
        @Positive(message = "Aluno invalido")
        Long alunoId,

        @NotBlank(message = "QR Code e obrigatorio")
        String qrData
) {
}
