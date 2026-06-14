package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.MotoristaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.MotoristaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
@RequiredArgsConstructor
public class MotoristaController {

    private final MotoristaService motoristaService;

    @PostMapping
    public ResponseEntity<MotoristaResponseDTO> criar(@Valid @RequestBody MotoristaRequestDTO dto) {
        MotoristaResponseDTO response = motoristaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MotoristaResponseDTO> buscarPorId(@PathVariable Long id) {
        MotoristaResponseDTO response = motoristaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MotoristaResponseDTO>> listarTodos() {
        List<MotoristaResponseDTO> response = motoristaService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MotoristaResponseDTO> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody MotoristaRequestDTO dto) {
        MotoristaResponseDTO response = motoristaService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/viagens")
    public ResponseEntity<List<ViagemResponseDTO>> listarViagens(@PathVariable Long id) {
        return ResponseEntity.ok(motoristaService.listarViagens(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        motoristaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
