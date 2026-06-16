ALTER TABLE presenca
    ADD COLUMN data_hora_reserva TIMESTAMP(6) NULL,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'RESERVADA',
    ADD CONSTRAINT ck_presenca_status CHECK (status IN ('RESERVADA', 'CONFIRMADA', 'CANCELADA'));

UPDATE presenca
SET data_hora_reserva = COALESCE(data_hora_validacao, CURRENT_TIMESTAMP(6)),
    status = CASE
        WHEN data_hora_validacao IS NULL THEN 'RESERVADA'
        ELSE 'CONFIRMADA'
    END
WHERE data_hora_reserva IS NULL;
