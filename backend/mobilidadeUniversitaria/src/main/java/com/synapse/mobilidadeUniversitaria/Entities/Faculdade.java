package com.synapse.mobilidadeUniversitaria.Entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "faculdade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Faculdade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;


    @OneToMany(mappedBy = "faculdade")
    private List<Aluno> alunos;

    @CreationTimestamp
    private LocalDateTime dataHoraValidacao;


}
