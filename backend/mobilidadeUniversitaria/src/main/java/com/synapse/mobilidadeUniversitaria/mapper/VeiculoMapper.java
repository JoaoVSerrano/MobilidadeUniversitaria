package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Veiculo;
import com.synapse.mobilidadeUniversitaria.dtos.request.VeiculoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.VeiculoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class VeiculoMapper {

    public Veiculo toEntity(VeiculoRequestDTO request) {
        if (request == null) return null;

        Veiculo v = new Veiculo();
        v.setPlaca(request.placa());
        v.setModelo(request.modelo());
        v.setCapacidadeTotal(request.capacidadeTotal());
        v.setAno(request.ano());
        v.setStatus(request.status() != null ? request.status().toUpperCase() : "ATIVO");
        v.setKmRodados(request.kmRodados() != null ? request.kmRodados() : 0);

        return v;
    }

    public void updateEntity(Veiculo v, VeiculoRequestDTO request) {
        if (v == null || request == null) return;

        v.setPlaca(request.placa());
        v.setModelo(request.modelo());
        v.setCapacidadeTotal(request.capacidadeTotal());
        if (request.ano() != null) {
            v.setAno(request.ano());
        }
        if (request.status() != null) {
            v.setStatus(request.status().toUpperCase());
        }
        if (request.kmRodados() != null) {
            v.setKmRodados(request.kmRodados());
        }
    }

    public VeiculoResponseDTO toResponse(Veiculo veiculo) {

        if (veiculo == null) return null;

        return new VeiculoResponseDTO(
                veiculo.getId(),
                veiculo.getPlaca(),
                veiculo.getModelo(),
                veiculo.getCapacidadeTotal(),
                veiculo.getAno(),
                veiculo.getStatus(),
                veiculo.getKmRodados(),
                veiculo.getProximaRevisao() != null ? veiculo.getProximaRevisao().toString() : null
        );
    }
}
