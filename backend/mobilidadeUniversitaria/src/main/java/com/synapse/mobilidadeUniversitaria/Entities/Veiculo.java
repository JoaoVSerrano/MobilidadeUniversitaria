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
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String placa;

    @Column(nullable = false)
    private String modelo;

    @Column(nullable = false)
    private int capacidadeTotal;

    @Column(nullable = false)
    private String status = "ATIVO";

    private Integer ano;
    private Integer kmRodados;
    private java.time.LocalDate proximaRevisao;
    private java.time.LocalDate ultimaManutencao;

}
