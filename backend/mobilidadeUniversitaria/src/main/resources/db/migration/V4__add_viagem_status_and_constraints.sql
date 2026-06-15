ALTER TABLE viagem
    ADD COLUMN data_hora_inicio DATETIME(6) NULL AFTER data_hora_chegada_prevista,
    ADD COLUMN data_hora_chegada_real DATETIME(6) NULL AFTER data_hora_inicio,
    ADD COLUMN status ENUM('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA') NOT NULL DEFAULT 'AGENDADA' AFTER data_hora_chegada_real;

ALTER TABLE presenca
    ADD CONSTRAINT uk_presenca_aluno_viagem UNIQUE (aluno_id, viagem_id);
