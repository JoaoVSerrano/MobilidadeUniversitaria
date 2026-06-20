package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.PresencaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.QRCodeConfirmacaoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeConfirmacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.PresencaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presencas")
@RequiredArgsConstructor
public class PresencaController {

    private final PresencaService presencaService;

    @PostMapping
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#dto.alunoId())")
    public ResponseEntity<PresencaDigitalResponseDTO> registrar(@Valid @RequestBody PresencaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presencaService.registrar(dto));
    }

    @PostMapping("/confirmar-qrcode")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#dto.alunoId())")
    public ResponseEntity<QRCodeConfirmacaoResponseDTO> confirmarPorQRCode(@Valid @RequestBody QRCodeConfirmacaoRequestDTO dto) {
        return ResponseEntity.ok(presencaService.confirmarPorQRCode(dto));
    }

    @GetMapping("/viagem/{viagemId}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isMotoristaDaViagem(#viagemId)")
    public ResponseEntity<List<PresencaDigitalResponseDTO>> listarPorViagem(@PathVariable Long viagemId) {
        return ResponseEntity.ok(presencaService.listarPorViagem(viagemId));
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isAlunoSelf(#alunoId)")
    public ResponseEntity<List<PresencaDigitalResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(presencaService.listarPorAluno(alunoId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        presencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.canAccessPresenca(#id)")
    public ResponseEntity<PresencaDigitalResponseDTO> confirmarPresenca(@PathVariable Long id) {
        return ResponseEntity.ok(presencaService.confirmarPresencaById(id));
    }
}
