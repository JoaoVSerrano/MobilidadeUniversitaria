package com.synapse.mobilidadeUniversitaria.DTOs;

import lombok.Data;

@Data
public class SystemSettingsResponseDTO {
    private String nomeInstituicao;
    private String emailContato;
    private String telefone;
    private Boolean reservasAutomaticas;
    private Boolean notificacoesEmail;
    private Boolean rastreamentoGps;
}
