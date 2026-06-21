package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.AtualizarParadaRequestDTO;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.service.ParadaService;
import com.synapse.mobilidadeUniversitaria.mapper.ViagemMapper;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/driver/trips")
@RequiredArgsConstructor
public class ParadaController {

    private final ParadaService paradaService;
    private final ViagemMapper viagemMapper;

    @PutMapping("/{id}/parada")
    @PreAuthorize("@authorizationService.isMotoristaDaViagem(#id)")
    public ResponseEntity<ViagemResponseDTO> atualizarParada(@PathVariable Long id, @Valid @RequestBody AtualizarParadaRequestDTO dto) {
        Viagem viagem = paradaService.atualizarParada(id, dto);
        return ResponseEntity.ok(viagemMapper.toResponse(viagem));
    }
}
