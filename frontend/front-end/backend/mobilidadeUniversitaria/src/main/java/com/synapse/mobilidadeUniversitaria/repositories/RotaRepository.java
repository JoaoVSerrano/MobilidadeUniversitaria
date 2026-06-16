package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RotaRepository extends JpaRepository<Rota, Long> {

    Optional<Rota> findByNomeRota(String nomeRota);

    boolean existsByNomeRota(String nomeRota);
}
