#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Iniciando o sistema Mobilidade Universitária..."

echo "Iniciando backend..."
./backend/start.sh

echo "Aguardando backend ficar disponível..."
backend_ready=false
for i in {1..60}; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/api/viagens || echo "000")
    case "$status_code" in
        200|401|403)
            echo "Backend está pronto!"
            backend_ready=true
            break
            ;;
    esac
    echo "Aguardando... ($i/60)"
    sleep 1
done

if [ "$backend_ready" != "true" ]; then
    echo "Backend não respondeu em tempo hábil. Abortando inicialização."
    exit 1
fi

echo "Iniciando o frontend (Angular)..."
cd frontend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm ci
fi

npm start &
FRONTEND_PID=$!
cd ..

echo "Sistemas iniciados."
echo "Backend: http://localhost:8082"
echo "Frontend: http://localhost:4200"
echo "Frontend PID: $FRONTEND_PID"

trap 'echo "Encerrando sistemas..."; kill $FRONTEND_PID 2>/dev/null || true; exit' SIGINT SIGTERM
wait
