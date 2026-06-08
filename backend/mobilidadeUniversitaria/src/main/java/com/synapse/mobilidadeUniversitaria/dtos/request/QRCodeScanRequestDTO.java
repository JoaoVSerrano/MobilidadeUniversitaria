package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record QRCodeScanRequestDTO(

        @NotBlank(message = "QR Code obrigatório")
        String qrData
) {
}
