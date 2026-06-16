package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.ViagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemService viagemService;

    @PostMapping
    public ResponseEntity<ViagemResponseDTO> criar(@Valid @RequestBody ViagemRequestDTO dto) {
        ViagemResponseDTO response = viagemService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> buscarPorId(@PathVariable Long id) {
        ViagemResponseDTO response = viagemService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listarTodos() {
        List<ViagemResponseDTO> response = viagemService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/proximas")
    public ResponseEntity<List<ViagemResponseDTO>> listarProximas() {
        return ResponseEntity.ok(viagemService.listarProximas());
    }

    @GetMapping("/hoje")
    public ResponseEntity<List<ViagemResponseDTO>> listarHoje() {
        return ResponseEntity.ok(viagemService.listarHoje());
    }

    @GetMapping("/motorista/{motoristaId}")
    @PreAuthorize("hasRole('GESTOR') or @authorizationService.isMotoristaSelf(#motoristaId)")
    public ResponseEntity<List<ViagemResponseDTO>> listarPorMotorista(@PathVariable Long motoristaId) {
        return ResponseEntity.ok(viagemService.listarPorMotorista(motoristaId));
    }

    @GetMapping("/stats")
    public ResponseEntity<ViagemStatsResponseDTO> estatisticas() {
        return ResponseEntity.ok(viagemService.estatisticas());
    }

    @PostMapping("/{id}/qrcode")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<QRCodeResponseDTO> gerarQRCode(@PathVariable Long id) {
        return ResponseEntity.ok(viagemService.gerarQRCode(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> atualizar(@PathVariable Long id,
                                                       @Valid @RequestBody ViagemRequestDTO dto) {
        ViagemResponseDTO response = viagemService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        viagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
