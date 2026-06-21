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
@Table(name = "rota")
public class Rota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeRota;
    private String descricao;

    @Column(nullable = false)
    private String pontoParada;

    @Column(columnDefinition = "TEXT")
    private String paradas; // JSON array de strings: ["Parada 1", "Parada 2"]

    @Column(nullable = false)
    private Boolean ativa = true;

}
