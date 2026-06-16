package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.AlunoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper extends UsuarioMapper {

    private final FaculdadeMapper faculdadeMapper;

    public AlunoMapper(EnderecoMapper enderecoMapper, FaculdadeMapper faculdadeMapper) {
        super(enderecoMapper);
        this.faculdadeMapper = faculdadeMapper;
    }

    public Aluno toEntity(AlunoRequestDTO dto) {
        if (dto == null) return null;

        Aluno aluno = new Aluno();
        updateCommon(aluno, dto);
        aluno.setStatusMatricula(dto.getStatusMatricula());
        return aluno;
    }

    public void updateEntity(Aluno aluno, AlunoRequestDTO dto) {
        if (aluno == null || dto == null) return;

        updateCommon(aluno, dto);
        aluno.setStatusMatricula(dto.getStatusMatricula());
    }

    public void updateEntity(Aluno aluno, AlunoUpdateRequestDTO dto) {
        if (aluno == null || dto == null) return;

        updateCommon(aluno, dto);
        aluno.setStatusMatricula(dto.getStatusMatricula());
    }

    public AlunoResponseDTO toResponse(Aluno aluno) {
        if (aluno == null) return null;

        AlunoResponseDTO dto = new AlunoResponseDTO();
        commonResponse(dto, aluno);
        dto.setFaculdade(faculdadeMapper.toResponse(aluno.getFaculdade()));
        dto.setStatusMatricula(aluno.getStatusMatricula());
        return dto;
    }
}
