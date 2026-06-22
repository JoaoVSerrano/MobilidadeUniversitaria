package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.PresencaDigital;
import com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaDigitalRepository extends JpaRepository<PresencaDigital, Long> {

    List<PresencaDigital> findByAlunoId(Long alunoId);

    List<PresencaDigital> findByViagemId(Long viagemId);

    Optional<PresencaDigital> findByAlunoIdAndViagemId(Long alunoId, Long viagemId);

    long countByViagemIdAndStatusNot(Long viagemId, PresencaStatus status);

    void deleteByAlunoId(Long alunoId);

    void deleteByViagemId(Long viagemId);

    @Query("""
            select count(distinct p.aluno.id)
            from PresencaDigital p
            where p.dataHoraReserva between :inicio and :fim
            """)
    long countDistinctAlunoIdByDataHoraReservaBetween(LocalDateTime inicio, LocalDateTime fim);
}
