package com.synapse.mobilidadeUniversitaria.Entities.enums;

import jakarta.persistence.Enumerated;

@Enumerated
public enum UserType {
    GESTOR,
    ALUNO,
    MOTORISTA
}
