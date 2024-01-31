# Compra Simples

## Backend

Iniciando com o backend, primeiro, acesse o diretório correspondente e instale as dependências.

```bash
cd backend
npm install
```

### PostgreSQL Docker Container

```bash
docker run --name nome-do-seu-container -e POSTGRES_PASSWORD=sua-senha -p 5432:5432 -d postgres
```

### Configurando o Servidor

No diretório `./config`, você encontrará um arquivo em formato JSON. Personalize conforme suas preferências:

```json
{
    "database": {
        "username": "postgres",
        "password": "sua-senha",
        "schema": "principal", // pode ser alterado conforme a preferência
        "host": "localhost",
        "dialect": "postgres"
    },
    "server": {
        "port": 8080
    },
    "security": {
        "secret": "qualquer-sequencia-de-caracteres",
        "tokenExpireTime": "1m" // tempo de expiração padrão do token de autenticação
    }
}
```

### Ferramenta `regenerateDatabase`

Esta ferramenta cria um novo schema, se necessário, e sincroniza as tabelas inicializadas em `./src/database/tables.mjs`. Automatiza o processo de configuração das tabelas no servidor PostgreSQL. Uma confirmação é necessária.

```bash
node ./tools/regenerateDatabase.mjs
```

### Inicializando o Servidor

Esta é a parte mais simples.

```bash
node index.mjs
```

### Documentação

A documentação do backend está no arquivo README.md dentro do diretório correspondente.

## Frontend

Para o frontend, comece acessando o diretório correspondente e instalando as dependências.

```bash
cd frontend
npm install
```

### Executando em Modo "Live"

Para testes rápidos, você pode executar o Vite de forma ágil.

```bash
npm run dev
```

### Documentação

Para detalhes como `build` e execução em ambiente de produção, consulte o README.md dentro do diretório do frontend.