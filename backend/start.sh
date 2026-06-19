#!/bin/bash
set -e

# Navigate to project root
cd "$(dirname "$0")"

echo "=========================================="
echo "  Go Campus Backend - Starting..."
echo "=========================================="

# Ensure directories exist
mkdir -p mobilidadeUniversitaria/data
mkdir -p mobilidadeUniversitaria/uploads

# Build if needed
if [ ! -f "mobilidadeUniversitaria/target/mobilidadeUniversitaria-0.0.1-SNAPSHOT.jar" ]; then
    echo "Building project..."
    cd mobilidadeUniversitaria
    chmod +x ./mvnw
    ./mvnw clean package -DskipTests -q
    cd ..
fi

# Check if Docker should be used
if [ "$1" = "--docker" ] || [ "$1" = "-d" ]; then
    echo "Starting with Docker..."
    cd mobilidadeUniversitaria
    docker compose up -d
    echo "Backend started on port 8081 (mapped to 8081)"
    echo "PostgreSQL started on port 5432"
else
    # Determine port
    PORT=${SERVER_PORT:-8080}

    echo "Starting standalone mode..."
    echo "Data directory: $(pwd)/mobilidadeUniversitaria/data"
    echo "Uploads directory: $(pwd)/mobilidadeUniversitaria/uploads"
    echo "Server port: $PORT"

    cd mobilidadeUniversitaria
    java -jar target/mobilidadeUniversitaria-0.0.1-SNAPSHOT.jar \
        --server.port=$PORT \
        --spring.datasource.url=jdbc:h2:file:./data/gocampusdb \
        --spring.jpa.hibernate.ddl-auto=update
fi

echo ""
echo "=========================================="
echo "  Backend ready!"
echo "=========================================="