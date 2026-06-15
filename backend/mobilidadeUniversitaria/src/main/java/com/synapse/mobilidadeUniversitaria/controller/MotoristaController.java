package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.MotoristaUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.MotoristaResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.MotoristaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
@RequiredArgsConstructor
public class MotoristaController {

    private final MotoristaService motoristaService;

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<MotoristaResponseDTO> criar(@Valid @RequestBody MotoristaRequestDTO dto) {
        MotoristaResponseDTO response = motoristaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isMotoristaSelf(#id)")
    public ResponseEntity<MotoristaResponseDTO> buscarPorId(@PathVariable Long id) {
        MotoristaResponseDTO response = motoristaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<MotoristaResponseDTO>> listarTodos() {
        List<MotoristaResponseDTO> response = motoristaService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isMotoristaSelf(#id)")
    public ResponseEntity<MotoristaResponseDTO> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody MotoristaUpdateRequestDTO dto) {
        MotoristaResponseDTO response = motoristaService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/viagens")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isMotoristaSelf(#id)")
    public ResponseEntity<List<ViagemResponseDTO>> listarViagens(@PathVariable Long id) {
        return ResponseEntity.ok(motoristaService.listarViagens(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        motoristaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
