package com.synapse.mobilidadeUniversitaria.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record ViagemRequestDTO(

    @NotNull(message = "Horario da partida necessário")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @Future(message = "A data de partida deve ser no futuro")
    LocalDateTime dataHoraPartida,

    @NotNull(message = "data e hora de chegada prevista é necessário")
    LocalDateTime dataHoraChegadaPrevista,

    @NotNull(message = "Motorista é obrigatório")
    Long motoristaId,

    @NotNull(message = "Veículo é obrigatório")
    Long veiculoId,

    @NotNull(message = "Rota é obrigatória")
    Long rotaId

) {
}
