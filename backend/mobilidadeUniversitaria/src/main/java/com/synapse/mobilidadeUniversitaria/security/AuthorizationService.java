package com.synapse.mobilidadeUniversitaria.security;

import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import com.synapse.mobilidadeUniversitaria.repositories.NotificacaoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.PresencaDigitalRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("authorizationService")
public class AuthorizationService {

    private final ViagemRepository viagemRepository;
    private final PresencaDigitalRepository presencaRepository;
    private final NotificacaoRepository notificacaoRepository;

    public AuthorizationService(ViagemRepository viagemRepository,
                                PresencaDigitalRepository presencaRepository,
                                NotificacaoRepository notificacaoRepository) {
        this.viagemRepository = viagemRepository;
        this.presencaRepository = presencaRepository;
        this.notificacaoRepository = notificacaoRepository;
    }

    public boolean isSelf(Long usuarioId) {
        AuthenticatedUser user = currentUser();
        return user != null && user.getId().equals(usuarioId);
    }

    public boolean isAlunoSelf(Long alunoId) {
        AuthenticatedUser user = currentUser();
        return user != null && UserType.ALUNO.equals(user.getUserType()) && user.getId().equals(alunoId);
    }

    public boolean isMotoristaSelf(Long motoristaId) {
        AuthenticatedUser user = currentUser();
        return user != null && UserType.MOTORISTA.equals(user.getUserType()) && user.getId().equals(motoristaId);
    }

    public boolean isMotoristaDaViagem(Long viagemId) {
        AuthenticatedUser user = currentUser();
        if (user == null || !UserType.MOTORISTA.equals(user.getUserType())) {
            return false;
        }

        return viagemRepository.findById(viagemId)
                .map(viagem -> viagem.getMotorista() != null && user.getId().equals(viagem.getMotorista().getId()))
                .orElse(false);
    }

    public boolean canAccessPresenca(Long presencaId) {
        AuthenticatedUser user = currentUser();
        if (user == null) {
            return false;
        }

        if (UserType.GESTOR.equals(user.getUserType())) {
            return true;
        }

        return presencaRepository.findById(presencaId)
                .map(presenca -> {
                    if (UserType.ALUNO.equals(user.getUserType())) {
                        return presenca.getAluno() != null && user.getId().equals(presenca.getAluno().getId());
                    }
                    if (UserType.MOTORISTA.equals(user.getUserType())) {
                        return presenca.getViagem() != null
                                && presenca.getViagem().getMotorista() != null
                                && user.getId().equals(presenca.getViagem().getMotorista().getId());
                    }
                    return false;
                })
                .orElse(false);
    }

    public boolean canAccessNotificacao(Long notificacaoId) {
        AuthenticatedUser user = currentUser();
        if (user == null) {
            return false;
        }

        if (UserType.GESTOR.equals(user.getUserType())) {
            return true;
        }

        return notificacaoRepository.findById(notificacaoId)
                .map(notificacao -> notificacao.getAluno() != null && user.getId().equals(notificacao.getAluno().getId()))
                .orElse(false);
    }

    public AuthenticatedUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            return null;
        }
        return user;
    }
}
