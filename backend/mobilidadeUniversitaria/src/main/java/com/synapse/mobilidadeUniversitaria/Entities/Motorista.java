package com.synapse.mobilidadeUniversitaria.Entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "motorista")
public class Motorista extends Usuario {


    @Column(nullable = false)
    private String cnhNumero;

    @Column(nullable = false)
    private LocalDate vencimentoCnh;
}
