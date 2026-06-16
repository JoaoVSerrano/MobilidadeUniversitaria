package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Faculdade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FaculdadeRepository extends JpaRepository<Faculdade, Long> {

    Optional<Faculdade> findByNome(String nome);

    boolean existsByNome(String nome);
}
