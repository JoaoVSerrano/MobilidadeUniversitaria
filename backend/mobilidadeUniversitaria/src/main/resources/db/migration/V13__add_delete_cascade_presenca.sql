-- Adicionar ON DELETE CASCADE para presenca
ALTER TABLE presenca DROP CONSTRAINT IF EXISTS fk_presenca_viagem;
ALTER TABLE presenca ADD CONSTRAINT fk_presenca_viagem
    FOREIGN KEY (viagem_id) REFERENCES viagem(id) ON DELETE CASCADE;

-- Adicionar ON DELETE CASCADE para notificacao
ALTER TABLE notificacao DROP CONSTRAINT IF EXISTS fk_notificacao_viagem;
ALTER TABLE notificacao ADD CONSTRAINT fk_notificacao_viagem
    FOREIGN KEY (viagem_id) REFERENCES viagem(id) ON DELETE CASCADE;

-- Adicionar ON DELETE CASCADE para notificacao_motorista
ALTER TABLE notificacao_motorista DROP CONSTRAINT IF EXISTS fk_notif_mot_viagem;
ALTER TABLE notificacao_motorista ADD CONSTRAINT fk_notif_mot_viagem
    FOREIGN KEY (viagem_id) REFERENCES viagem(id) ON DELETE CASCADE;

-- Adicionar ON DELETE CASCADE para presenca_fisica (se existir)
ALTER TABLE presenca_fisica DROP CONSTRAINT IF EXISTS fk_presenca_fisica_aluno;
ALTER TABLE presenca_fisica ADD CONSTRAINT fk_presenca_fisica_aluno
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE;
