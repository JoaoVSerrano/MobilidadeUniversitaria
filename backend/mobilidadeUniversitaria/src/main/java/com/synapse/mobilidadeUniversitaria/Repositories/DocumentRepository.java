package com.synapse.mobilidadeUniversitaria.Repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Documento, Long> {
}
