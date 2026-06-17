-- Seed System Settings
UPDATE system_settings SET nome_instituicao = 'Go Campus University', email_contato = 'contato@gocampus.edu', telefone = '(11) 99999-9999' WHERE id = 1;

-- Seed Users (Passwords are 'password' hashed)
INSERT INTO usuario (id, nome, email, senha, role) VALUES 
(1, 'Gestor Admin', 'admin@gocampus.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20VeQQubODod.a6T5aL/X.Fj1u51OQy', 'GESTOR'),
(2, 'Motorista Teste', 'motorista@gocampus.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20VeQQubODod.a6T5aL/X.Fj1u51OQy', 'MOTORISTA'),
(3, 'Aluno Teste', 'aluno@gocampus.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20VeQQubODod.a6T5aL/X.Fj1u51OQy', 'ALUNO');

-- Seed Vehicles
INSERT INTO veiculo (id, placa, modelo, capacidade_total, status, ano, km_rodados) VALUES 
(1, 'ABC-1234', 'Mercedes-Benz OF-1721', 45, 'ATIVO', 2020, 125000),
(2, 'DEF-5678', 'Volvo B270F', 40, 'ATIVO', 2021, 98000);

-- Seed Routes
INSERT INTO rota (id, nome_rota, descricao, ponto_parada, ativa) VALUES 
(1, 'Centro-Campus', 'Rota principal do centro', 'Terminal Central', TRUE),
(2, 'Bairro-Campus', 'Rota do bairro', 'Praça da Matriz', TRUE);
