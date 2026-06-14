ALTER TABLE presenca
    ADD COLUMN data_hora_reserva DATETIME(6) NULL AFTER viagem_id,
    ADD COLUMN status ENUM('RESERVADA', 'CONFIRMADA', 'CANCELADA') NOT NULL DEFAULT 'RESERVADA' AFTER data_hora_reserva;

UPDATE presenca
SET data_hora_reserva = COALESCE(data_hora_validacao, CURRENT_TIMESTAMP(6)),
    status = CASE
        WHEN data_hora_validacao IS NULL THEN 'RESERVADA'
        ELSE 'CONFIRMADA'
    END
WHERE data_hora_reserva IS NULL;
