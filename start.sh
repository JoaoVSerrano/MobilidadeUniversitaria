#!/bin/bash

# Script para iniciar o backend e o frontend do sistema Mobilidade Universitária

echo "Iniciando o sistema Mobilidade Universitária..."

# Iniciar o Backend
echo "Iniciando o backend (Spring Boot)..."
cd backend/mobilidadeUniversitaria
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ../..

# Iniciar o Frontend
echo "Iniciando o frontend (Angular)..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo "Sistemas iniciados."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Função para encerrar os processos ao pressionar Ctrl+C
trap 'echo "Encerrando sistemas..."; kill $BACKEND_PID $FRONTEND_PID; exit' SIGINT

# Aguardar os processos
wait
