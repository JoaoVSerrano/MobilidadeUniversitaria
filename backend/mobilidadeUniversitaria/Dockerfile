FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN mkdir -p /app/data /app/uploads

COPY target/mobilidadeUniversitaria-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENV SPRING_DATASOURCE_URL=jdbc:h2:file:/app/data/gocampusdb
ENV H2_CONSOLE_ENABLED=false
ENV SERVER_PORT=8081

ENTRYPOINT ["java", "-jar", "app.jar"]