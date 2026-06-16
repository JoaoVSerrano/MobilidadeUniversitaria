package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.GestorResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.GestorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gestores")
@RequiredArgsConstructor
public class GestorController {

    private final GestorService gestorService;

    @PostMapping
    public ResponseEntity<GestorResponseDTO> criar(@Valid @RequestBody UsuarioRequestDTO dto) {
        GestorResponseDTO response = gestorService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GestorResponseDTO> buscarPorId(@PathVariable Long id) {
        GestorResponseDTO response = gestorService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GestorResponseDTO>> listarTodos() {
        List<GestorResponseDTO> response = gestorService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GestorResponseDTO> atualizar(@PathVariable Long id,
                                                       @Valid @RequestBody UsuarioRequestDTO dto) {
        GestorResponseDTO response = gestorService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        gestorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
