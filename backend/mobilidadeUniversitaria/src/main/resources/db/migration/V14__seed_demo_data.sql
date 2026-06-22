-- Seed Faculdade
INSERT INTO faculdade (id, nome, endereco_id) VALUES (1, 'Universidade Go Campus', 1)
ON CONFLICT DO NOTHING;

-- Atualizar aluno do seed para ter faculdade
UPDATE aluno SET faculdade_id = 1 WHERE id = 3;

-- Seed Rota
INSERT INTO rota (id, nome_rota, descricao, ponto_parada, ativa) VALUES
(1, 'Centro-Campus', 'Rota principal do centro até o campus', 'Terminal Central', TRUE)
ON CONFLICT DO NOTHING;

-- Seed Veiculo
INSERT INTO veiculo (id, placa, modelo, capacidade_total, status) VALUES
(1, 'GCM-0001', 'Mercedes Sprinter 2022', 45, 'ATIVO')
ON CONFLICT DO NOTHING;

-- Seed Viagem (amanhã às 07:30)
INSERT INTO viagem (id, data_hora_partida, data_hora_chegada_prevista, status, motorista_id, veiculo_id, rota_id)
VALUES (1,
  (CURRENT_DATE + INTERVAL '1 day' + TIME '07:30:00'),
  (CURRENT_DATE + INTERVAL '1 day' + TIME '08:30:00'),
  'AGENDADA', 2, 1, 1)
ON CONFLICT DO NOTHING;
