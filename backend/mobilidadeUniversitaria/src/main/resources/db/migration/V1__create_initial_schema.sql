CREATE TABLE IF NOT EXISTS endereco (
    id BIGSERIAL PRIMARY KEY,
    bairro VARCHAR(255),
    cep VARCHAR(255) NOT NULL,
    complemento VARCHAR(255),
    data_hora_validacao TIMESTAMP(6),
    numero VARCHAR(255),
    rua VARCHAR(255),
    tipo_local VARCHAR(20),
    CONSTRAINT ck_endereco_tipo_local CHECK (tipo_local IN ('RESIDENCIAL', 'FACULDADE'))
);

CREATE TABLE IF NOT EXISTS faculdade (
    id BIGSERIAL PRIMARY KEY,
    data_hora_validacao TIMESTAMP(6),
    nome VARCHAR(255) NOT NULL,
    endereco_id BIGINT,
    CONSTRAINT fk_faculdade_endereco FOREIGN KEY (endereco_id) REFERENCES endereco (id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    cpf VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    endereco_id BIGINT,
    CONSTRAINT ck_usuario_user_type CHECK (user_type IN ('GESTOR', 'ALUNO', 'MOTORISTA')),
    CONSTRAINT uk_usuario_cpf UNIQUE (cpf),
    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT fk_usuario_endereco FOREIGN KEY (endereco_id) REFERENCES endereco (id)
);

CREATE TABLE IF NOT EXISTS aluno (
    status_matricula VARCHAR(20) NOT NULL,
    faculdade_id BIGINT,
    id BIGINT NOT NULL PRIMARY KEY,
    CONSTRAINT ck_aluno_status_matricula CHECK (status_matricula IN ('PENDENTE', 'ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA', 'REPROVADA')),
    CONSTRAINT fk_aluno_faculdade FOREIGN KEY (faculdade_id) REFERENCES faculdade (id),
    CONSTRAINT fk_aluno_usuario FOREIGN KEY (id) REFERENCES usuario (id)
);

CREATE TABLE IF NOT EXISTS motorista (
    vencimento_cnh DATE NOT NULL,
    id BIGINT NOT NULL PRIMARY KEY,
    cnh_numero VARCHAR(255) NOT NULL,
    CONSTRAINT fk_motorista_usuario FOREIGN KEY (id) REFERENCES usuario (id)
);

CREATE TABLE IF NOT EXISTS rota (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(255),
    nome_rota VARCHAR(255),
    ponto_parada VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS veiculo (
    capacidade_total INTEGER NOT NULL,
    id BIGSERIAL PRIMARY KEY,
    modelo VARCHAR(255) NOT NULL,
    placa VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS viagem (
    data_hora_chegada_prevista TIMESTAMP(6) NOT NULL,
    data_hora_partida TIMESTAMP(6) NOT NULL,
    id BIGSERIAL PRIMARY KEY,
    motorista_id BIGINT,
    rota_id BIGINT,
    veiculo_id BIGINT,
    CONSTRAINT fk_viagem_motorista FOREIGN KEY (motorista_id) REFERENCES motorista (id),
    CONSTRAINT fk_viagem_rota FOREIGN KEY (rota_id) REFERENCES rota (id),
    CONSTRAINT fk_viagem_veiculo FOREIGN KEY (veiculo_id) REFERENCES veiculo (id)
);

CREATE TABLE IF NOT EXISTS notificacao (
    lida BOOLEAN NOT NULL,
    aluno_id BIGINT,
    data_hora_envio TIMESTAMP(6),
    id BIGSERIAL PRIMARY KEY,
    viagem_id BIGINT,
    mensagem VARCHAR(255) NOT NULL,
    tipo_notificacao VARCHAR(255) NOT NULL,
    CONSTRAINT fk_notificacao_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_notificacao_viagem FOREIGN KEY (viagem_id) REFERENCES viagem (id)
);

CREATE TABLE IF NOT EXISTS NotificacaoAluno (
    lida BOOLEAN NOT NULL,
    aluno_id BIGINT,
    id BIGINT NOT NULL PRIMARY KEY,
    lida_em TIMESTAMP(6),
    notificacao_id BIGINT,
    CONSTRAINT fk_notificacao_aluno_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_notificacao_aluno_notificacao FOREIGN KEY (notificacao_id) REFERENCES notificacao (id)
);

CREATE TABLE IF NOT EXISTS presenca (
    aluno_id BIGINT,
    data_hora_validacao TIMESTAMP(6),
    id BIGSERIAL PRIMARY KEY,
    viagem_id BIGINT,
    CONSTRAINT fk_presenca_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_presenca_viagem FOREIGN KEY (viagem_id) REFERENCES viagem (id)
);

CREATE TABLE IF NOT EXISTS presenca_fisica (
    embarcado BOOLEAN,
    aluno_id BIGINT,
    confirmado_em TIMESTAMP(6),
    id BIGSERIAL PRIMARY KEY,
    CONSTRAINT fk_presenca_fisica_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id)
);
