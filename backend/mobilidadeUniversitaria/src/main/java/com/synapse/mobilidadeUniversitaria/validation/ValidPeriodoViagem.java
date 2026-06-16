package com.synapse.mobilidadeUniversitaria.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = PeriodoViagemValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPeriodoViagem {

    String message() default "Data de chegada prevista deve ser posterior a data de partida";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
