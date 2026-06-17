CREATE TABLE IF NOT EXISTS documento (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    caminho_arquivo VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data_upload TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT,
    CONSTRAINT ck_documento_status CHECK (status IN ('PENDENTE', 'VALIDADO', 'EXPIRADO')),
    CONSTRAINT fk_documento_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY,
    nome_instituicao VARCHAR(200),
    email_contato VARCHAR(150),
    telefone VARCHAR(20),
    reservas_automaticas BOOLEAN DEFAULT TRUE,
    notificacoes_email BOOLEAN DEFAULT TRUE,
    rastreamento_gps BOOLEAN DEFAULT FALSE
);

INSERT INTO system_settings (id, nome_instituicao, reservas_automaticas, notificacoes_email, rastreamento_gps) 
VALUES (1, 'Instituição Padrão', TRUE, TRUE, FALSE);
