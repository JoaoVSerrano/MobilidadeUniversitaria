package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Notificacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByAlunoId(Long alunoId);

    List<Notificacao> findByViagemId(Long viagemId);

    List<Notificacao> findByAlunoIdAndLida(Long alunoId, Boolean lida);

    Page<Notificacao> findByAlunoId(Long alunoId, Pageable pageable);

    List<Notificacao> findByTipoNotificacao(String tipoNotificacao);

    void deleteByViagemId(Long viagemId);

    void deleteByAlunoId(Long alunoId);
}
