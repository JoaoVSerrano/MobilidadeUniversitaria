package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.response.NotificacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('GESTOR', 'ALUNO', 'MOTORISTA')")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(notificacaoService.listarDoUsuarioLogado());
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authorizationService.canAccessNotificacao(#id)")
    public ResponseEntity<NotificacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/lida")
    @PreAuthorize("@authorizationService.canAccessNotificacao(#id)")
    public ResponseEntity<NotificacaoResponseDTO> marcarComoLida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.marcarComoLida(id));
    }

    @PatchMapping("/lidas")
    @PreAuthorize("hasAnyRole('GESTOR', 'ALUNO')")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        notificacaoService.marcarTodasComoLidas();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nao-lidas/count")
    @PreAuthorize("hasAnyRole('GESTOR', 'ALUNO', 'MOTORISTA')")
    public ResponseEntity<Map<String, Long>> contarNaoLidas() {
        return ResponseEntity.ok(Map.of("count", notificacaoService.contarNaoLidas()));
    }
}
