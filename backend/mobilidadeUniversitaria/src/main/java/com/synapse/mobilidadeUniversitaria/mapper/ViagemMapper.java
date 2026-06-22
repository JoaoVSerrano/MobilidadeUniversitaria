package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ViagemMapper {

    private final MotoristaMapper motoristaMapper;
    private final VeiculoMapper veiculoMapper;
    private final RotaMapper rotaMapper;

    public Viagem toEntity(ViagemRequestDTO request) {
        if (request == null) return null;

        Viagem v = new Viagem();
        v.setDataHoraPartida(request.dataHoraPartida());
        v.setDataHoraChegadaPrevista(request.dataHoraChegadaPrevista());
        // Note: IDs are resolved in the Service layer to ensure entity existence
        return v;
    }

    public void updateEntity(Viagem v, ViagemRequestDTO request) {
        if (v == null || request == null) return;

        v.setDataHoraPartida(request.dataHoraPartida());
        v.setDataHoraChegadaPrevista(request.dataHoraChegadaPrevista());
    }

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
