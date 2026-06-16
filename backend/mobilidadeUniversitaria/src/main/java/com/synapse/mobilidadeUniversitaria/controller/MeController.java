package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.UsuarioUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<UsuarioResponseDTO> buscarPerfil() {
        return ResponseEntity.ok(usuarioService.buscarUsuarioLogado());
    }

    @PutMapping
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(@Valid @RequestBody UsuarioUpdateRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarUsuarioLogado(dto));
    }
}
