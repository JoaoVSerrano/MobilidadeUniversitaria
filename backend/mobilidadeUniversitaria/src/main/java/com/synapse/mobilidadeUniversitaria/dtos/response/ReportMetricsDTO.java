package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportMetricsDTO {
    private long totalViagens;
    private double variacaoViagens;
    private double ocupacaoMedia;
    private double variacaoOcupacao;
    private double pontualidade;
    private long alunosAtivos;
    private long alunosPendentes;
    private long veiculosAtivos;
    private long veiculosTotal;
    private long veiculosManutencao;
}
