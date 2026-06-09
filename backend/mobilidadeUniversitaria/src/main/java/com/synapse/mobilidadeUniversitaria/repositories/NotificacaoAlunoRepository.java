package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.NotificacaoAluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoAlunoRepository extends JpaRepository<NotificacaoAluno, Long> {

    List<NotificacaoAluno> findByAlunoId(Long alunoId);

    List<NotificacaoAluno> findByNotificacaoId(Long notificacaoId);

    List<NotificacaoAluno> findByAlunoIdAndLida(Long alunoId, boolean lida);
}
