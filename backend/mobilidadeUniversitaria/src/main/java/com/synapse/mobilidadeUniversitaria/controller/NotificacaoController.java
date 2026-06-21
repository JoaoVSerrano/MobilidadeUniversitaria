package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista;
import com.synapse.mobilidadeUniversitaria.dtos.response.NotificacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.AuthService;
import com.synapse.mobilidadeUniversitaria.service.NotificacaoService;
import com.synapse.mobilidadeUniversitaria.repositories.NotificacaoMotoristaRepository;
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
    private final NotificacaoMotoristaRepository notificacaoMotoristaRepository;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('GESTOR', 'ALUNO', 'MOTORISTA')")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(notificacaoService.listarDoUsuarioLogado());
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authService.canAccessNotificacao(#id)")
    public ResponseEntity<NotificacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/lida")
    @PreAuthorize("@authService.canAccessNotificacao(#id)")
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

    @GetMapping("/motorista")
    @PreAuthorize("hasRole('MOTORISTA')")
    public ResponseEntity<List<Map<String, Object>>> listarDoMotoristaLogado() {
        Long motoristaId = authService.currentUser().getId();
        List<NotificacaoMotorista> notifs = notificacaoMotoristaRepository.findByMotoristaId(motoristaId);
        List<Map<String, Object>> result = notifs.stream().map(n -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", n.getId());
            map.put("tipoNotificacao", n.getTipoNotificacao());
            map.put("mensagem", n.getMensagem());
            map.put("dataHoraEnvio", n.getDataHoraEnvio());
            map.put("lida", n.getLida());
            map.put("viagemId", n.getViagem() != null ? n.getViagem().getId() : null);
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/motorista/{id}/lida")
    @PreAuthorize("hasRole('MOTORISTA')")
    public ResponseEntity<Void> marcarNotificacaoMotoristaLida(@PathVariable Long id) {
        notificacaoMotoristaRepository.findById(id).ifPresent(n -> {
            n.setLida(true);
            notificacaoMotoristaRepository.save(n);
        });
        return ResponseEntity.noContent().build();
    }
}
