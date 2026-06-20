#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=========================================="
echo "  Go Campus Backend - Starting..."
echo "=========================================="

mkdir -p mobilidadeUniversitaria/data
mkdir -p mobilidadeUniversitaria/uploads

# Stop the currently running backend container if it exists.
if [ -n "$(docker ps -q -f name='^/gocampus-backend$')" ]; then
    docker exec gocampus-backend sh -lc 'kill 1' >/dev/null 2>&1 || true
    sleep 2
fi

docker rm -f gocampus-backend >/dev/null 2>&1 || true

cd mobilidadeUniversitaria
chmod +x ./mvnw
./mvnw clean package -DskipTests -q
cd ..

docker compose up -d --build --no-deps backend

echo "Backend started on port 8082"
echo ""
echo "=========================================="
echo "  Backend ready!"
echo "=========================================="
