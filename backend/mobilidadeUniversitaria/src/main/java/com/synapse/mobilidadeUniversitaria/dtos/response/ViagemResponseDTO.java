package com.synapse.mobilidadeUniversitaria.dtos.response;

import java.time.LocalDateTime;

public record ViagemResponseDTO(
        Long id,
        LocalDateTime dataHoraPartida,
        LocalDateTime dataHoraChegadaPrevista,
        MotoristaResponseDTO motorista,
        VeiculoResponseDTO veiculo,
        RotaResponseDTO rota
) {
}
