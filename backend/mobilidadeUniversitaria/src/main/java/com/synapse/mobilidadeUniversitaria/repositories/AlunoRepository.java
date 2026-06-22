package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Page<Aluno> findByStatusMatricula(StatusMatricula status, Pageable pageable);

    long countByStatusMatricula(StatusMatricula status);

    long countByStatusMatriculaAndCreatedAtBetween(StatusMatricula status, LocalDateTime inicio, LocalDateTime fim);
}
