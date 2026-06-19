#!/bin/bash
set -e

# Ensure data directory exists for H2 file-based persistence
mkdir -p data
mkdir -p uploads

echo "Starting Go Campus Backend..."
echo "Data will be persisted to: $(pwd)/data"
echo "Uploads will be stored in: $(pwd)/uploads"

cd mobilidadeUniversitaria

# Check if Maven wrapper exists, otherwise use mvn
if [ -f "./mvnw" ]; then
    chmod +x ./mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring-boot.run.arguments=--server.port=8081"
else
    mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring-boot.run.arguments=--server.port=8081"
fi