package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.ViagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripsAliasController {

    private final ViagemService viagemService;

    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listarTodos() {
        return ResponseEntity.ok(viagemService.listarTodos());
    }

    @GetMapping("/stats")
    public ResponseEntity<ViagemStatsResponseDTO> estatisticas() {
        return ResponseEntity.ok(viagemService.estatisticas());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ViagemResponseDTO>> listarProximas() {
        return ResponseEntity.ok(viagemService.listarProximas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viagemService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ViagemResponseDTO> criar(@Valid @RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagemService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.ok(viagemService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        viagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
