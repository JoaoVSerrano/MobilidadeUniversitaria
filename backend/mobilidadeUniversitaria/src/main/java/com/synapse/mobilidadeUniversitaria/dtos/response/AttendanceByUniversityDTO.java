package com.synapse.mobilidadeUniversitaria.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceByUniversityDTO {
    private String faculdade;
    private long totalAlunos;
    private long presentes;
}
