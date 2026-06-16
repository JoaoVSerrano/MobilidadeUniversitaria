package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.RotaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.RotaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RoutesAliasController {

    private final RotaService rotaService;

    @GetMapping
    public ResponseEntity<List<RotaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(rotaService.listarTodos());
    }

    @GetMapping("/stats")
    public ResponseEntity<RotaStatsResponseDTO> estatisticas() {
        return ResponseEntity.ok(rotaService.estatisticas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RotaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(rotaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<RotaResponseDTO> criar(@Valid @RequestBody RotaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rotaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RotaResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody RotaRequestDTO dto) {
        return ResponseEntity.ok(rotaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        rotaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
