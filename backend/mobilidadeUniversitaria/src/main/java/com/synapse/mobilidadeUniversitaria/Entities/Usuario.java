package com.synapse.mobilidadeUniversitaria.Entities;

import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(nullable = false)
    private String nome;

    
    @Column(nullable = false, unique = true)
    private String email;

    
    @Column(nullable = false)
    private String senha;

    
    @Column(nullable = false, unique = true)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @ManyToOne
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @Column(nullable = false)
    private String telefone;

}