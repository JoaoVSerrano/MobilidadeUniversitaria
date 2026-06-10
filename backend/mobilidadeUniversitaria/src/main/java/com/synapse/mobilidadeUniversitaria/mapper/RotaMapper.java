package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import com.synapse.mobilidadeUniversitaria.dtos.request.RotaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class RotaMapper {

    public Rota toEntity(RotaRequestDTO request) {
        if (request == null) return null;

        Rota rota = new Rota();
        rota.setNomeRota(request.nomeRota());
        rota.setDescricao(request.descricao());
        rota.setPontoParada(request.pontoParada());

        return rota;
    }

    public void updateEntity(Rota rota, RotaRequestDTO request) {
        if (rota == null || request == null) return;

        rota.setNomeRota(request.nomeRota());
        rota.setDescricao(request.descricao());
        rota.setPontoParada(request.pontoParada());
    }

    public RotaResponseDTO toResponse(Rota rota) {
        if (rota == null) return null;

        return new RotaResponseDTO(
                rota.getId(),
                rota.getNomeRota(),
                rota.getDescricao(),
                rota.getPontoParada()
        );
    }
}
