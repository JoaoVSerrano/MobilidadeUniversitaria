-- Adicionar colunas acao e acao_url na tabela notificacao
ALTER TABLE notificacao ADD COLUMN IF NOT EXISTS acao VARCHAR(255);
ALTER TABLE notificacao ADD COLUMN IF NOT EXISTS acao_url VARCHAR(500);