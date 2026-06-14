package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.synapse.mobilidadeUniversitaria.validation.ValidPeriodoViagem;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@ValidPeriodoViagem
public record ViagemRequestDTO(

        @NotNull(message = "Horario da partida e obrigatorio")
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        @Future(message = "A data de partida deve ser no futuro")
        LocalDateTime dataHoraPartida,

        @NotNull(message = "Data e hora de chegada prevista e obrigatoria")
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        @Future(message = "A data de chegada prevista deve ser no futuro")
        LocalDateTime dataHoraChegadaPrevista,

        @NotNull(message = "Motorista e obrigatorio")
        @Positive(message = "Motorista deve ser um id positivo")
        Long motoristaId,

        @NotNull(message = "Veiculo e obrigatorio")
        @Positive(message = "Veiculo deve ser um id positivo")
        Long veiculoId,

        @NotNull(message = "Rota e obrigatoria")
        @Positive(message = "Rota deve ser um id positivo")
        Long rotaId
) {
}
