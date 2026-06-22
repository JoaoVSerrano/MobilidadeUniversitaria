-- Add creation timestamp to usuario for real dashboard growth metrics
ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(6);

UPDATE usuario
SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP)
WHERE created_at IS NULL;

ALTER TABLE usuario
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE usuario
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
