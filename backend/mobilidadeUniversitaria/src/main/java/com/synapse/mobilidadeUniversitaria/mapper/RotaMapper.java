package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import com.synapse.mobilidadeUniversitaria.dtos.request.RotaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class RotaMapper {

    public Rota toEntity(RotaRequestDTO request) {

        Rota rota = new Rota();
        rota.setNomeRota(request.nomeRota());
        rota.setDescricao(request.descricao());
        rota.setPontoParada(request.pontoParada());

        return rota;
    }

    public void toUpdate(Rota rota, RotaRequestDTO request) {

        rota.setNomeRota(request.nomeRota());
        rota.setDescricao(request.descricao());
        rota.setPontoParada(request.pontoParada());

    }

    public RotaResponseDTO toResponse(Rota rota) {

        return new RotaResponseDTO(
                rota.getId(),
                rota.getNomeRota(),
                rota.getDescricao(),
                rota.getPontoParada()
        );
    }
}
