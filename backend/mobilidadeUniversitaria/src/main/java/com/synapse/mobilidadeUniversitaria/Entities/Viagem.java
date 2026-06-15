package com.synapse.mobilidadeUniversitaria.Entities;

import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.annotation.EnableMBeanExport;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHoraPartida;

    @Column(nullable = false)
    private LocalDateTime dataHoraChegadaPrevista;

    private LocalDateTime dataHoraInicio;

    private LocalDateTime dataHoraChegadaReal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ViagemStatus status = ViagemStatus.AGENDADA;

    @OneToMany(mappedBy = "viagem")
    private List<Notificacao> notificacoes;

    @ManyToOne
    @JoinColumn(name = "motorista_id")
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "rota_id")
    private Rota rota;
}



