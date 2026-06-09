package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.PresencaDigital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaDigitalRepository extends JpaRepository<PresencaDigital, Long> {

    List<PresencaDigital> findByAlunoId(Long alunoId);

    List<PresencaDigital> findByViagemId(Long viagemId);

    Optional<PresencaDigital> findByAlunoIdAndViagemId(Long alunoId, Long viagemId);
}
