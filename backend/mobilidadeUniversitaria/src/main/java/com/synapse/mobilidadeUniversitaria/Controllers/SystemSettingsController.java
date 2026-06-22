package com.synapse.mobilidadeUniversitaria.Controllers;

import com.synapse.mobilidadeUniversitaria.Entities.SystemSettings;
import com.synapse.mobilidadeUniversitaria.Services.SystemSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GESTOR')")
public class SystemSettingsController {

    private final SystemSettingsService service;

    @GetMapping("/settings")
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings settings) {
        return ResponseEntity.ok(service.saveSettings(settings));
    }
}
