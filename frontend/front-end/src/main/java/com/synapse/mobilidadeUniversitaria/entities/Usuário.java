package com.synapse.mobilidadeUniversitaria.entities;

import com.synapse.mobilidadeUniversitaria.entities.enums.UserType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public abstract class Usuário {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String CPF;
    private UserType userType;
    private String phoneNumber;



}
