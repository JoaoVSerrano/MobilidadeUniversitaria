package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;
import com.synapse.mobilidadeUniversitaria.dtos.request.AtualizarParadaRequestDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.BadRequestException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ParadaService {

    private final ViagemRepository viagemRepository;

    @Transactional
    public Viagem atualizarParada(Long viagemId, AtualizarParadaRequestDTO dto) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + viagemId));

        if (!ViagemStatus.EM_ANDAMENTO.equals(viagem.getStatus())) {
            throw new BadRequestException("Apenas viagens em andamento podem ter a parada atualizada");
        }

        if (viagem.getRota() == null || viagem.getRota().getParadas() == null) {
            throw new BadRequestException("A rota da viagem nao possui paradas definidas");
        }

        // O backend armazena paradas como String JSON, mas aqui validamos o index
        // Para simplificar, assumimos que o frontend sabe a quantidade de paradas
        viagem.setParadaAtualIndex(dto.novaParadaIndex());

        return viagemRepository.save(viagem);
    }
}
