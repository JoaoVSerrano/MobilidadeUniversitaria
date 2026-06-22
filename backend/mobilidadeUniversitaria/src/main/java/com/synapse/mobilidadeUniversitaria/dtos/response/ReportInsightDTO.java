package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportInsightDTO {
    private String tipo; // "success", "warning", "info", "danger"
    private String icone; // icon name
    private String titulo;
    private String descricao;
}
