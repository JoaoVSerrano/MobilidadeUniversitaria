package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @GetMapping("/tipo/{tipoUsuario}")
    public ResponseEntity<List<UsuarioResponseDTO>> listarPorTipo(@PathVariable UserType tipoUsuario) {
        return ResponseEntity.ok(usuarioService.listarPorTipo(tipoUsuario));
    }

    @GetMapping("/stats")
    public ResponseEntity<UsuarioStatsResponseDTO> estatisticas() {
        return ResponseEntity.ok(usuarioService.estatisticas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
