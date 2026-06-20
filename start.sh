#!/bin/bash

# Script para iniciar o backend e o frontend do sistema Mobilidade Universitária

echo "Iniciando o sistema Mobilidade Universitária..."

# Verificar se o container Docker está rodando
if ! docker ps | grep -q gocampus-backend; then
    echo "Iniciando container backend (Docker)..."
    docker start gocampus-backend
else
    echo "Container backend já está em execução."
fi

# Verificar se o banco de dados está rodando
if ! docker ps | grep -q gocampus-db; then
    echo "Iniciando container database (Docker)..."
    docker start gocampus-db
else
    echo "Container database já está em execução."
fi

# Aguardar o backend estar disponível
echo "Aguardando backend ficar disponível..."
for i in {1..30}; do
    if curl -s http://localhost:8082/api/auth/register/student-request > /dev/null 2>&1; then
        echo "Backend está pronto!"
        break
    fi
    echo "Aguardando... ($i/30)"
    sleep 1
done

# Iniciar o Frontend
echo "Iniciando o frontend (Angular)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "Sistemas iniciados."
echo "Backend: http://localhost:8082"
echo "Frontend: http://localhost:4200"
echo "Frontend PID: $FRONTEND_PID"

# Função para encerrar os processos ao pressionar Ctrl+C
trap 'echo "Encerrando sistemas..."; kill $FRONTEND_PID; exit' SIGINT

# Aguardar os processos
wait