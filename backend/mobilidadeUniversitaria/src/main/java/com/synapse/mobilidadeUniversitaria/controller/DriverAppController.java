package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.ViagemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverAppController {

    private final ViagemService viagemService;

    @PostMapping("/trips/{tripId}/qrcode")
    public ResponseEntity<QRCodeResponseDTO> gerarQRCodeDaViagem(@PathVariable Long tripId) {
        return ResponseEntity.ok(viagemService.gerarQRCode(tripId));
    }
}
