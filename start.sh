#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Iniciando o sistema Mobilidade Universitária..."

echo "Iniciando backend..."
./backend/start.sh

echo "Aguardando backend ficar disponível..."
for i in {1..30}; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/api/viagens || echo "000")
    case "$status_code" in
        200|401|403)
            echo "Backend está pronto!"
            break
            ;;
    esac
    echo "Aguardando... ($i/30)"
    sleep 1
done

echo "Iniciando o frontend (Angular)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "Sistemas iniciados."
echo "Backend: http://localhost:8082"
echo "Frontend: http://localhost:4200"
echo "Frontend PID: $FRONTEND_PID"

trap 'echo "Encerrando sistemas..."; kill $FRONTEND_PID; exit' SIGINT SIGTERM
wait
