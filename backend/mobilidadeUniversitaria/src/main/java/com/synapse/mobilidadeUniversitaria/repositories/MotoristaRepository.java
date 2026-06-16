package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {

    Optional<Motorista> findByCnhNumero(String cnhNumero);

}
