-- Adicionar coluna parada_atual_index缺失
ALTER TABLE viagem ADD COLUMN IF NOT EXISTS parada_atual_index INTEGER DEFAULT 0;