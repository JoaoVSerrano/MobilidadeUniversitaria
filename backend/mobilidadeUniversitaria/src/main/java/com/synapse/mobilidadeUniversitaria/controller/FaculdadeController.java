package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.FaculdadeRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.FaculdadeResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.FaculdadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculdades")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GESTOR')")
public class FaculdadeController {

    private final FaculdadeService faculdadeService;

    @PostMapping
    public ResponseEntity<FaculdadeResponseDTO> criar(@Valid @RequestBody FaculdadeRequestDTO dto) {
        FaculdadeResponseDTO response = faculdadeService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaculdadeResponseDTO> buscarPorId(@PathVariable Long id) {
        FaculdadeResponseDTO response = faculdadeService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FaculdadeResponseDTO>> listarTodos() {
        List<FaculdadeResponseDTO> response = faculdadeService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<FaculdadeResponseDTO>> buscarPorNome(@RequestParam String nome) {
        List<FaculdadeResponseDTO> response = faculdadeService.buscarPorNome(nome);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaculdadeResponseDTO> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody FaculdadeRequestDTO dto) {
        FaculdadeResponseDTO response = faculdadeService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        faculdadeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
