-- Seed System Settings
UPDATE system_settings SET nome_instituicao = 'Go Campus University', email_contato = 'contato@gocampus.edu', telefone = '(11) 99999-9999' WHERE id = 1;

-- Seed Enderecos first (required by foreign key)
INSERT INTO endereco (id, cep, rua, bairro, numero, tipo_local) VALUES
(1, '01001-000', 'Praça da Sé', 'Sé', '1', 'RESIDENCIAL'),
(2, '01310-100', 'Avenida Paulista', 'Bela Vista', '1000', 'RESIDENCIAL'),
(3, '02030-100', 'Avenida Brazil', 'Jardim América', '500', 'RESIDENCIAL');

-- Seed Users (Passwords are 'password' hashed with bcrypt)
-- Hash: $2a$10$tp9lNfP7st0/lgTBSZdeLeTdKAU94yYM55drvghWMSXnnnZSwHHSG = 'password'
INSERT INTO usuario (id, nome, email, senha, cpf, telefone, user_type, endereco_id) VALUES
(1, 'Gestor Admin', 'admin@gocampus.com', '$2a$10$tp9lNfP7st0/lgTBSZdeLeTdKAU94yYM55drvghWMSXnnnZSwHHSG', '12345678901', '(11) 99999-0001', 'GESTOR', 1),
(2, 'Motorista Teste', 'motorista@gocampus.com', '$2a$10$tp9lNfP7st0/lgTBSZdeLeTdKAU94yYM55drvghWMSXnnnZSwHHSG', '12345678902', '(11) 99999-0002', 'MOTORISTA', 2),
(3, 'Aluno Teste', 'aluno@gocampus.com', '$2a$10$tp9lNfP7st0/lgTBSZdeLeTdKAU94yYM55drvghWMSXnnnZSwHHSG', '12345678903', '(11) 99999-0003', 'ALUNO', 3);

-- Seed Vehicles
INSERT INTO veiculo (id, placa, modelo, capacidade_total, status, ano, km_rodados) VALUES
(1, 'ABC-1234', 'Mercedes-Benz OF-1721', 45, 'ATIVO', 2020, 125000),
(2, 'DEF-5678', 'Volvo B270F', 40, 'ATIVO', 2021, 98000);

-- Seed Routes
INSERT INTO rota (id, nome_rota, descricao, ponto_parada, ativa) VALUES
(1, 'Centro-Campus', 'Rota principal do centro', 'Terminal Central', TRUE),
(2, 'Bairro-Campus', 'Rota do bairro', 'Praça da Matriz', TRUE);

-- Seed alunos (table aluno is separate from usuario)
INSERT INTO aluno (id, status_matricula, faculdade_id) VALUES
(3, 'ATIVA', NULL);

-- Seed motorista entries
INSERT INTO motorista (id, cnh_numero, vencimento_cnh) VALUES
(2, '1234567890', '2028-12-31');