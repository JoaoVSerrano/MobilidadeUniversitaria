package com.synapse.mobilidadeUniversitaria.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "aluno")
public class Aluno extends Usuario {

    @ManyToOne
    @JoinColumn(name = "faculdade_id")
    private Faculdade faculdade;

    private String statusMatricula;

}
