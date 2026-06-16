package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ViagemMapper {


    private final MotoristaMapper motoristaMapper;
    private final VeiculoMapper veiculoMapper;
    private final RotaMapper rotaMapper;

    public ViagemResponseDTO toResponse(Viagem viagem) {

        if (viagem == null) return null;

        return new ViagemResponseDTO(
                viagem.getId(),
                viagem.getDataHoraPartida(),
                viagem.getDataHoraChegadaPrevista(),
                viagem.getDataHoraInicio(),
                viagem.getDataHoraChegadaReal(),
                viagem.getStatus(),
                motoristaMapper.toResponse(viagem.getMotorista()),
                veiculoMapper.toResponse(viagem.getVeiculo()),
                rotaMapper.toResponse(viagem.getRota())
        );
    }
}
