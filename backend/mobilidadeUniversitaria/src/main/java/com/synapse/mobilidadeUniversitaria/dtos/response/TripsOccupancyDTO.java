package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TripsOccupancyDTO {
    private String mes;
    private long totalViagens;
    private double ocupacaoPercent;
}
