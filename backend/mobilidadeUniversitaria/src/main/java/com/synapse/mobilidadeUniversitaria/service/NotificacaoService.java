package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Notificacao;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.dtos.response.NotificacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.NotificacaoRepository;
import com.synapse.mobilidadeUniversitaria.security.AuthenticatedUser;
import com.synapse.mobilidadeUniversitaria.service.AuthService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final AuthService authService;

    public NotificacaoService(NotificacaoRepository notificacaoRepository,
                              AuthService authService) {
        this.notificacaoRepository = notificacaoRepository;
        this.authService = authService;
    }

    public List<NotificacaoResponseDTO> listarDoUsuarioLogado() {
        AuthenticatedUser user = authService.currentUser();
        List<Notificacao> notificacoes;

        if (UserType.GESTOR.equals(user.getUserType())) {
            notificacoes = notificacaoRepository.findAll();
        } else if (UserType.ALUNO.equals(user.getUserType())) {
            notificacoes = notificacaoRepository.findByAlunoId(user.getId());
        } else {
            notificacoes = new ArrayList<>();
        }

        return notificacoes
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
        AuthenticatedUser user = authService.currentUser();
        List<Notificacao> notificacoes = UserType.GESTOR.equals(user.getUserType())
                ? notificacaoRepository.findAll()
                : notificacaoRepository.findByAlunoId(user.getId());
        notificacoes.forEach(notificacao -> notificacao.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    public long contarNaoLidas() {
        AuthenticatedUser user = authService.currentUser();
        List<Notificacao> notificacoes = UserType.GESTOR.equals(user.getUserType())
                ? notificacaoRepository.findAll()
                : notificacaoRepository.findByAlunoId(user.getId());

        return notificacoes
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

        String acao = null;
        String acaoUrl = null;

        if (viagemId != null) {
            switch (notificacao.getTipoNotificacao()) {
                case "NOVA_VIAGEM" -> {
                    acao = "Reservar Presença";
                    acaoUrl = "/aluno/reserva?viagemId=" + viagemId;
                }
                case "VIAGEM_INICIADA" -> {
                    acao = "Ver Viagem";
                    acaoUrl = "/aluno/minhas-viagens";
                }
                default -> {
                    acao = "Ver Detalhes";
                    acaoUrl = "/aluno/viagem/" + viagemId;
                }
            }
        }

        return new NotificacaoResponseDTO(
                notificacao.getId(),
                alunoId,
                viagemId,
                notificacao.getTipoNotificacao(),
                notificacao.getMensagem(),
                notificacao.getDataHoraEnvio(),
                notificacao.getLida(),
                acao,
                acaoUrl
        );
    }
}
