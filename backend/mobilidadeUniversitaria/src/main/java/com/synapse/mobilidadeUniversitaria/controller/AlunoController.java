package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.AlunoUpdateRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.AlunoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<AlunoResponseDTO> criar(@Valid @RequestBody AlunoRequestDTO dto) {
        AlunoResponseDTO response = alunoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#id)")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        AlunoResponseDTO response = alunoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<AlunoResponseDTO>> listarTodos() {
        List<AlunoResponseDTO> response = alunoService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#id)")
    public ResponseEntity<AlunoResponseDTO> atualizar(@PathVariable Long id,
                                                      @Valid @RequestBody AlunoUpdateRequestDTO dto) {
        AlunoResponseDTO response = alunoService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/viagens")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#id)")
    public ResponseEntity<List<ViagemResponseDTO>> listarViagens(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.listarViagens(id));
    }

    @GetMapping("/{id}/presencas")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#id)")
    public ResponseEntity<List<PresencaDigitalResponseDTO>> listarPresencas(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.listarPresencas(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
