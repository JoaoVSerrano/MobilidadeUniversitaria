package com.synapse.mobilidadeUniversitaria.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao_cadastro_aluno")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SolicitacaoCadastroAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String nomeFaculdade;

    private String cep;
    private String rua;
    private String bairro;
    private String numero;
    private String complemento;
    private String tipoLocal;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status = "PENDENTE";
}
