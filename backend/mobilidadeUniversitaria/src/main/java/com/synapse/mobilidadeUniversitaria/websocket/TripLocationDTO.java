package com.synapse.mobilidadeUniversitaria.websocket;

import lombok.Data;

@Data
public class TripLocationDTO {
    private Long tripId;
    private Double latitude;
    private Double longitude;
    private Double velocidade;
    private String proximaParada;
    private Double distanciaRestante;
    private Long timestamp;
}
