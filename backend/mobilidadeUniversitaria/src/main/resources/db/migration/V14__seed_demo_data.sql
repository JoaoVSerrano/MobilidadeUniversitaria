-- Seed Faculdade
MERGE INTO faculdade (id, nome, endereco_id) KEY(id) VALUES (1, 'Universidade Go Campus', 1);

-- Atualizar aluno do seed para ter faculdade
UPDATE aluno SET faculdade_id = 1 WHERE id = 3;

-- Seed Rota
MERGE INTO rota (id, nome_rota, descricao, ponto_parada, ativa) KEY(id) VALUES
(1, 'Centro-Campus', 'Rota principal do centro até o campus', 'Terminal Central', TRUE);

-- Seed Veiculo
MERGE INTO veiculo (id, placa, modelo, capacidade_total, status) KEY(id) VALUES
(1, 'GCM-0001', 'Mercedes Sprinter 2022', 45, 'ATIVO');

-- Seed Viagem (amanhã às 07:30)
MERGE INTO viagem (id, data_hora_partida, data_hora_chegada_prevista, status, motorista_id, veiculo_id, rota_id) KEY(id) VALUES (1,
  TIMESTAMP '2099-01-01 07:30:00',
  TIMESTAMP '2099-01-01 08:30:00',
  'AGENDADA', 2, 1, 1);
