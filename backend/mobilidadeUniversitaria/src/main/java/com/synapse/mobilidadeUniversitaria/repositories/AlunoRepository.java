package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.enums.StatusMatricula;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Page<Aluno> findByStatusMatricula(StatusMatricula status, Pageable pageable);
}
