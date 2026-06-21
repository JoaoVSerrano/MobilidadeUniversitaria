CREATE TABLE IF NOT EXISTS notificacao_motorista (
    id BIGSERIAL PRIMARY KEY,
    motorista_id BIGINT NOT NULL,
    viagem_id BIGINT,
    tipo_notificacao VARCHAR(50) NOT NULL,
    mensagem TEXT,
    data_hora_envio TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_notif_mot_motorista FOREIGN KEY (motorista_id) REFERENCES motorista(id),
    CONSTRAINT fk_notif_mot_viagem FOREIGN KEY (viagem_id) REFERENCES viagem(id)
);

ALTER TABLE rota ADD COLUMN IF NOT EXISTS paradas TEXT;
