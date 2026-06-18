# Mobilidade Universitária

Sistema de gestão para mobilidade universitária, permitindo a administração de veículos, viagens, usuários (alunos e motoristas) e relatórios.

## Estrutura do Projeto
- `backend/`: API em Java (Spring Boot)
- `frontend/`: Aplicação em Angular

## Como Executar

Para iniciar a aplicação, utilize o script `start.sh` na raiz do projeto:

```bash
chmod +x start.sh
./start.sh
```

### Pré-requisitos
- Java 21+
- Node.js 22+ (Angular CLI)
- Maven
- PostgreSQL (configurado no backend)

## Configurações
- A URL do backend é centralizada em `frontend/src/environments/environment.ts`.
- As permissões CORS são configuradas no `backend/mobilidadeUniversitaria/src/main/resources/application.properties`.
