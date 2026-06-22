package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.VeiculoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.VeiculoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.VeiculoStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.VeiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GESTOR')")
public class VeiculoController {

    private final VeiculoService veiculoService;

    @PostMapping
    public ResponseEntity<VeiculoResponseDTO> criar(@Valid @RequestBody VeiculoRequestDTO dto) {
        VeiculoResponseDTO response = veiculoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeiculoResponseDTO> buscarPorId(@PathVariable Long id) {
        VeiculoResponseDTO response = veiculoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VeiculoResponseDTO>> listarTodos() {
        List<VeiculoResponseDTO> response = veiculoService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<VeiculoStatsResponseDTO> estatisticas() {
        return ResponseEntity.ok(veiculoService.estatisticas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VeiculoResponseDTO> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody VeiculoRequestDTO dto) {
        VeiculoResponseDTO response = veiculoService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        veiculoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
