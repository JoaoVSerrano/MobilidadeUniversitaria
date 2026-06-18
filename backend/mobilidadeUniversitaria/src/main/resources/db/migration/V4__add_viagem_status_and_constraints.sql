ALTER TABLE viagem ADD COLUMN data_hora_inicio TIMESTAMP(6) NULL;
ALTER TABLE viagem ADD COLUMN data_hora_chegada_real TIMESTAMP(6) NULL;
ALTER TABLE viagem ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'AGENDADA';
ALTER TABLE viagem ADD CONSTRAINT ck_viagem_status CHECK (status IN ('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'));

ALTER TABLE presenca ADD CONSTRAINT uk_presenca_aluno_viagem UNIQUE (aluno_id, viagem_id);
