package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Notificacao;
import com.synapse.mobilidadeUniversitaria.dtos.response.NotificacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.NotificacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public List<NotificacaoResponseDTO> listarTodas() {
        return notificacaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificacaoResponseDTO buscarPorId(Long id) {
        return toResponse(buscarNotificacaoPorId(id));
    }

    public NotificacaoResponseDTO marcarComoLida(Long id) {
        Notificacao notificacao = buscarNotificacaoPorId(id);
        notificacao.setLida(true);
        return toResponse(notificacaoRepository.save(notificacao));
    }

    public void marcarTodasComoLidas() {
        List<Notificacao> notificacoes = notificacaoRepository.findAll();
        notificacoes.forEach(notificacao -> notificacao.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    public long contarNaoLidas() {
        return notificacaoRepository.findAll()
                .stream()
                .filter(notificacao -> Boolean.FALSE.equals(notificacao.getLida()))
                .count();
    }

    private Notificacao buscarNotificacaoPorId(Long id) {
        return notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacao nao encontrada com id: " + id));
    }

    private NotificacaoResponseDTO toResponse(Notificacao notificacao) {
        Long alunoId = notificacao.getAluno() == null ? null : notificacao.getAluno().getId();
        Long viagemId = notificacao.getViagem() == null ? null : notificacao.getViagem().getId();

        return new NotificacaoResponseDTO(
                notificacao.getId(),
                alunoId,
                viagemId,
                notificacao.getTipoNotificacao(),
                notificacao.getMensagem(),
                notificacao.getDataHoraEnvio(),
                notificacao.getLida()
        );
    }
}
