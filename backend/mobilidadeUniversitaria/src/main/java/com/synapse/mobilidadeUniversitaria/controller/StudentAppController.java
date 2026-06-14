package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.QRCodeConfirmacaoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeConfirmacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.PresencaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentAppController {

    private final PresencaService presencaService;

    @PostMapping("/qrcode/scan")
    public ResponseEntity<QRCodeConfirmacaoResponseDTO> confirmarPresencaPorQRCode(@Valid @RequestBody QRCodeConfirmacaoRequestDTO dto) {
        return ResponseEntity.ok(presencaService.confirmarPorQRCode(dto));
    }
}
