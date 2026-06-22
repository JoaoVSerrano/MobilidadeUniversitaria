package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;

import java.time.LocalDateTime;

public record ViagemResponseDTO(
        Long id,
        LocalDateTime dataHoraPartida,
        LocalDateTime dataHoraChegadaPrevista,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraChegadaReal,
        Integer paradaAtualIndex,
        ViagemStatus status,
        MotoristaResponseDTO motorista,
        VeiculoResponseDTO veiculo,
        RotaResponseDTO rota
) {
}
