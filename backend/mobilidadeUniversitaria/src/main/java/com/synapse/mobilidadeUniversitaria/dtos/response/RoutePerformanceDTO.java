package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoutePerformanceDTO {
    private Long rotaId;
    private String nomeRota;
    private long totalViagens;
    private double mediaOcupacao;
    private long alunosTransportados;
    private String statusPerformance; // "Ótimo", "Regular", "Baixo"
}
