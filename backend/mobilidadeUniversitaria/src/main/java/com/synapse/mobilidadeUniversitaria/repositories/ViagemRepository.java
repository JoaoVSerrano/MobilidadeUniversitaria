package com.synapse.mobilidadeUniversitaria.repositories;

import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    List<Viagem> findByDataHoraPartidaAfterOrderByDataHoraPartidaAsc(LocalDateTime dataHora);

    @Query("""
            select count(v) from Viagem v
            where v.motorista.id = :motoristaId
              and v.status <> com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus.CANCELADA
              and (:ignorarId is null or v.id <> :ignorarId)
              and :partida < v.dataHoraChegadaPrevista
              and :chegada > v.dataHoraPartida
            """)
    long countConflitosMotorista(Long motoristaId, LocalDateTime partida, LocalDateTime chegada, Long ignorarId);

    @Query("""
            select count(v) from Viagem v
            where v.veiculo.id = :veiculoId
              and v.status <> com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus.CANCELADA
              and (:ignorarId is null or v.id <> :ignorarId)
              and :partida < v.dataHoraChegadaPrevista
              and :chegada > v.dataHoraPartida
            """)
    long countConflitosVeiculo(Long veiculoId, LocalDateTime partida, LocalDateTime chegada, Long ignorarId);

    void deleteByRotaId(Long rotaId);

    void deleteByMotoristaId(Long motoristaId);
}
