package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.PresencaFisica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresencaFisicaRepository extends JpaRepository<PresencaFisica, Long> {

    List<PresencaFisica> findByAlunoId(Long alunoId);

    List<PresencaFisica> findByEmbarcado(Boolean embarcado);

    List<PresencaFisica> findByAlunoIdAndEmbarcado(Long alunoId, Boolean embarcado);
}
