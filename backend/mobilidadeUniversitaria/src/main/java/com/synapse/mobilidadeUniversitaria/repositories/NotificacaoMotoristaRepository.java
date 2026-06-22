package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificacaoMotoristaRepository extends JpaRepository<NotificacaoMotorista, Long> {
    List<NotificacaoMotorista> findByMotoristaId(Long motoristaId);
    List<NotificacaoMotorista> findByMotoristaIdAndLida(Long motoristaId, Boolean lida);
    void deleteByViagemId(Long viagemId);
    void deleteByMotoristaId(Long motoristaId);
}
