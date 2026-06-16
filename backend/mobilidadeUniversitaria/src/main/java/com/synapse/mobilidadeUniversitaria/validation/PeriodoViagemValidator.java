package com.synapse.mobilidadeUniversitaria.validation;

import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PeriodoViagemValidator implements ConstraintValidator<ValidPeriodoViagem, ViagemRequestDTO> {

    @Override
    public boolean isValid(ViagemRequestDTO dto, ConstraintValidatorContext context) {
        if (dto == null || dto.dataHoraPartida() == null || dto.dataHoraChegadaPrevista() == null) {
            return true;
        }

        return dto.dataHoraChegadaPrevista().isAfter(dto.dataHoraPartida());
    }
}
