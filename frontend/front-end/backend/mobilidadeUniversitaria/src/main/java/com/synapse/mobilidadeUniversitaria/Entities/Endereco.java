package com.synapse.mobilidadeUniversitaria.Entities;

import com.synapse.mobilidadeUniversitaria.Entities.enums.LocalType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cep;

    private String bairro;
    private String rua;
    private String numero;
    private String complemento;

    @CreationTimestamp
    private LocalDateTime dataHoraValidacao;

    @Enumerated(EnumType.STRING)
    private LocalType tipoLocal;

}
