package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.SolicitacaoCadastroAluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoCadastroAlunoRepository extends JpaRepository<SolicitacaoCadastroAluno, Long> {
    List<SolicitacaoCadastroAluno> findByStatus(String status);
    Optional<SolicitacaoCadastroAluno> findByEmail(String email);
    Optional<SolicitacaoCadastroAluno> findByCpf(String cpf);
}
