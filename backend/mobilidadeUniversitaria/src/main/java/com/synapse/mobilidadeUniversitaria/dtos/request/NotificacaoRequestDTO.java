package com.synapse.mobilidadeUniversitaria.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotificacaoRequestDTO {

    @NotBlank(message = "Mensagem é obrigatória")
    private String mensagem;

    @NotNull(message = "Lista de alunos é obrigatória")
    @NotEmpty(message = "Informe ao menos um aluno")
    private List<Long> alunoIds;

}