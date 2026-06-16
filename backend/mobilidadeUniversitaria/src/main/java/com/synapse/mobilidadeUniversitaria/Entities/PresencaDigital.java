package com.synapse.mobilidadeUniversitaria.Entities;

import com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "presenca")
public class PresencaDigital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "viagem_id")
    private Viagem viagem;

    @CreationTimestamp
    private LocalDateTime dataHoraReserva;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PresencaStatus status = PresencaStatus.RESERVADA;

    private LocalDateTime dataHoraValidacao;
}
