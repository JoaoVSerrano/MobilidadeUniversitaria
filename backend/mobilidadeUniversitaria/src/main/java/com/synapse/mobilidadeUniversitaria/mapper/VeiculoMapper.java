package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Veiculo;
import com.synapse.mobilidadeUniversitaria.dtos.request.VeiculoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.VeiculoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class VeiculoMapper {

    public Veiculo toEntitiy(VeiculoRequestDTO request) {

        if (request == null) return null;

        Veiculo v = new Veiculo();
        v.setPlaca(request.placa());
        v.setModelo(request.modelo());
        v.setCapacidadeTotal(request.capacidadeTotal());

        return v;
    }

    public void UpdateEntity(Veiculo v, VeiculoRequestDTO request) {

        v.setPlaca(request.placa());
        v.setModelo(request.modelo());
        v.setCapacidadeTotal(request.capacidadeTotal());


    }

    public VeiculoResponseDTO toResponse(Veiculo veiculo) {

        if (veiculo == null) return null;

        return new VeiculoResponseDTO(
                veiculo.getId(),
                veiculo.getPlaca(),
                veiculo.getModelo(),
                veiculo.getCapacidadeTotal()
        );
    }
}
