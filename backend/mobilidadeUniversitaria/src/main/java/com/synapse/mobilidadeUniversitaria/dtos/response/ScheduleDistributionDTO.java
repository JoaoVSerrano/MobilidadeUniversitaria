package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDistributionDTO {
    private String faixaHoraria;
    private long quantidade;
    private double percentual;
}
