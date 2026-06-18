package com.synapse.mobilidadeUniversitaria.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings {

    @Id
    @Column(nullable = false)
    private Integer id = 1;

    @Column(length = 200)
    private String nomeInstituicao;

    @Column(length = 150)
    private String emailContato;

    @Column(length = 20)
    private String telefone;

    @Column
    private Boolean reservasAutomaticas = true;

    @Column
    private Boolean notificacoesEmail = true;

    @Column
    private Boolean rastreamentoGps = false;
}
