package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.QRCodeScanRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeConfirmacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.security.AuthorizationService;
import com.synapse.mobilidadeUniversitaria.service.AlunoService;
import com.synapse.mobilidadeUniversitaria.service.PresencaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentAppController {

    private final PresencaService presencaService;
    private final AlunoService alunoService;
    private final AuthorizationService authorizationService;

    @GetMapping("/viagens")
    public ResponseEntity<List<ViagemResponseDTO>> listarMinhasViagens() {
        return ResponseEntity.ok(alunoService.listarViagens(authorizationService.currentUser().getId()));
    }

    @GetMapping("/presencas")
    public ResponseEntity<List<PresencaDigitalResponseDTO>> listarMinhasPresencas() {
        return ResponseEntity.ok(presencaService.listarDoAlunoLogado());
    }

    @PostMapping("/trips/{viagemId}/reserve")
    public ResponseEntity<PresencaDigitalResponseDTO> reservarPresenca(@PathVariable Long viagemId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presencaService.reservarParaAlunoLogado(viagemId));
    }

    @PostMapping("/qrcode/scan")
    public ResponseEntity<QRCodeConfirmacaoResponseDTO> confirmarPresencaPorQRCode(@Valid @RequestBody QRCodeScanRequestDTO dto) {
        return ResponseEntity.ok(presencaService.confirmarPorQRCodeDoAlunoLogado(dto.qrData()));
    }
}
