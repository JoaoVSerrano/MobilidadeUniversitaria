package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.RotaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.RotaResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.RotaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotas")
@RequiredArgsConstructor
public class RotaController {

    private final RotaService rotaService;

    @PostMapping
    public ResponseEntity<RotaResponseDTO> criar(@Valid @RequestBody RotaRequestDTO dto) {
        RotaResponseDTO response = rotaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RotaResponseDTO> buscarPorId(@PathVariable Long id) {
        RotaResponseDTO response = rotaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RotaResponseDTO>> listarTodos() {
        List<RotaResponseDTO> response = rotaService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RotaResponseDTO> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody RotaRequestDTO dto) {
        RotaResponseDTO response = rotaService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        rotaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
