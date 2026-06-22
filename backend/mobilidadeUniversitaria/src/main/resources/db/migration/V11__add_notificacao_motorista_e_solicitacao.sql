-- Tabela de notificações para motoristas
CREATE TABLE IF NOT EXISTS notificacao_motorista (
    id BIGSERIAL PRIMARY KEY,
    motorista_id BIGINT NOT NULL,
    viagem_id BIGINT,
    tipo_notificacao VARCHAR(50) NOT NULL,
    mensagem TEXT,
    data_hora_envio TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_notif_mot_motorista FOREIGN KEY (motorista_id) REFERENCES motorista(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_mot_viagem FOREIGN KEY (viagem_id) REFERENCES viagem(id) ON DELETE CASCADE
);

-- Tabela de solicitações de cadastro de aluno
CREATE TABLE IF NOT EXISTS solicitacao_cadastro_aluno (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    nome_faculdade VARCHAR(200) NOT NULL,
    cep VARCHAR(20),
    rua VARCHAR(255),
    bairro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    tipo_local VARCHAR(20),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
);

-- Adicionar campo paradas na rota (se não existir)
ALTER TABLE rota ADD COLUMN IF NOT EXISTS paradas TEXT;
