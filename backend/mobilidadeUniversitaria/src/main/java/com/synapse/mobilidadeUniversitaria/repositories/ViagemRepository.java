package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    List<Viagem> findByMotoristaId(Long motoristaId);

    List<Viagem> findByVeiculoId(Long veiculoId);

    List<Viagem> findByRotaId(Long rotaId);

    Page<Viagem> findByMotoristaId(Long motoristaId, Pageable pageable);

    List<Viagem> findByDataHoraPartidaBetween(LocalDateTime inicio, LocalDateTime fim);
}
