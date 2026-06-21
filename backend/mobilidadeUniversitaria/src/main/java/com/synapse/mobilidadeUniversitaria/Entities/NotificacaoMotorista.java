package com.synapse.mobilidadeUniversitaria.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "notificacao_motorista")
public class NotificacaoMotorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "motorista_id", nullable = false)
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "viagem_id")
    private Viagem viagem;

    @Column(nullable = false)
    private String tipoNotificacao;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @CreationTimestamp
    private LocalDateTime dataHoraEnvio;

    @Column(nullable = false)
    private Boolean lida = false;
}
