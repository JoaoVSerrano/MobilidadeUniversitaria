CREATE TABLE IF NOT EXISTS endereco (
    id BIGINT NOT NULL AUTO_INCREMENT,
    bairro VARCHAR(255),
    cep VARCHAR(255) NOT NULL,
    complemento VARCHAR(255),
    data_hora_validacao DATETIME(6),
    numero VARCHAR(255),
    rua VARCHAR(255),
    tipo_local ENUM('RESIDENCIAL', 'FACULDADE'),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS faculdade (
    id BIGINT NOT NULL AUTO_INCREMENT,
    data_hora_validacao DATETIME(6),
    nome VARCHAR(255) NOT NULL,
    endereco_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_faculdade_endereco FOREIGN KEY (endereco_id) REFERENCES endereco (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cpf VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    user_type ENUM('GESTOR', 'ALUNO', 'MOTORISTA') NOT NULL,
    endereco_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuario_cpf UNIQUE (cpf),
    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT fk_usuario_endereco FOREIGN KEY (endereco_id) REFERENCES endereco (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS aluno (
    status_matricula ENUM('PENDENTE', 'ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA', 'REPROVADA') NOT NULL,
    faculdade_id BIGINT,
    id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_aluno_faculdade FOREIGN KEY (faculdade_id) REFERENCES faculdade (id),
    CONSTRAINT fk_aluno_usuario FOREIGN KEY (id) REFERENCES usuario (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS motorista (
    vencimento_cnh DATE NOT NULL,
    id BIGINT NOT NULL,
    cnh_numero VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_motorista_usuario FOREIGN KEY (id) REFERENCES usuario (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rota (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255),
    nome_rota VARCHAR(255),
    ponto_parada VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS veiculo (
    capacidade_total INTEGER NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    modelo VARCHAR(255) NOT NULL,
    placa VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS viagem (
    data_hora_chegada_prevista DATETIME(6) NOT NULL,
    data_hora_partida DATETIME(6) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    motorista_id BIGINT,
    rota_id BIGINT,
    veiculo_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_viagem_motorista FOREIGN KEY (motorista_id) REFERENCES motorista (id),
    CONSTRAINT fk_viagem_rota FOREIGN KEY (rota_id) REFERENCES rota (id),
    CONSTRAINT fk_viagem_veiculo FOREIGN KEY (veiculo_id) REFERENCES veiculo (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notificacao (
    lida BIT NOT NULL,
    aluno_id BIGINT,
    data_hora_envio DATETIME(6),
    id BIGINT NOT NULL AUTO_INCREMENT,
    viagem_id BIGINT,
    mensagem VARCHAR(255) NOT NULL,
    tipo_notificacao VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_notificacao_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_notificacao_viagem FOREIGN KEY (viagem_id) REFERENCES viagem (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS NotificacaoAluno (
    lida BIT NOT NULL,
    aluno_id BIGINT,
    id BIGINT NOT NULL,
    lida_em DATETIME(6),
    notificacao_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_notificacao_aluno_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_notificacao_aluno_notificacao FOREIGN KEY (notificacao_id) REFERENCES notificacao (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS presenca (
    aluno_id BIGINT,
    data_hora_validacao DATETIME(6),
    id BIGINT NOT NULL AUTO_INCREMENT,
    viagem_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_presenca_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id),
    CONSTRAINT fk_presenca_viagem FOREIGN KEY (viagem_id) REFERENCES viagem (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS presenca_fisica (
    embarcado BIT,
    aluno_id BIGINT,
    confirmado_em DATETIME(6),
    id BIGINT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    CONSTRAINT fk_presenca_fisica_aluno FOREIGN KEY (aluno_id) REFERENCES aluno (id)
) ENGINE=InnoDB;
