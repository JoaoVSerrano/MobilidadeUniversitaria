package com.synapse.mobilidadeUniversitaria.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "NotificacaoAluno")
public class NotificacaoAluno {


    @Id
    private Long id;

    @ManyToOne
    private Notificacao notificacao;

    @ManyToOne
    private Aluno aluno;

    private boolean lida;
    private LocalDateTime lidaEm;
}