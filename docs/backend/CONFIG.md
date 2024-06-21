# ARQUIVO DE CONFIGURAÇÃO

## **SUMÁRIO**

- [**DATABASE**](#database)
- [**SERVER**](#server)
- [**SECURITY**](#security)
- [**FERRAMENTAS**](#ferramentas)

O arquivo de configuração fica localizado em `./config/config.json`.

## **DATABASE**

|CAMPO|DESCRIÇÃO|
|---|---|
|username|Usuário utilizado para conectar ao servidor do banco de dados.
|password|Senha utilizada para conectar ao servidor do banco de dados.
|schema  |O esquema padrão onde ficará todas as tabelas.|
|host    |Endereço IP do servidor do banco de dados.|
|dialect |Testado apenas com `Postgres`.|

## **SERVER**

|CAMPO|DESCRIÇÃO|
|---|---|
|port           |A porta em que a API funcionará.
|origin         |Endereço do cliente (frontend) que utilizará a API, serve para fins de autenticação.
|credential     |Define se é aceito o recebimento de credencials.|
|sameFromRequest|Define se é aceito requisições de qualquer origem (Recomendado apenas para testes)|

## **SECURITY**

|CAMPO|DESCRIÇÃO|
|---|---|
|secret         |De preferência textos longos e com caracteres bem diversos, não há uma regra.
|tokenExpireTime|Define o tempo que o cliente seguirá autenticado no servidor.
|prefixLength   |Ajuste fino da encriptação, define o tamanho dos textos aleatórios que serão concatenados no inicio do texto alvo.
|sufixLength    |Ajuste fino da encriptação, define o tamanho dos textos aleatórios que serão concatenados no fim do texto alvo.
|test           |Desliga a necessidade de autenticação para requisições da API.

## **EXEMPLO**

**ps: Não utilize em produção**

```json
{
    "database": {
        "username": "postgres",
        "password": "example",
        "port": 5432,
        "schema": "principal",
        "host": "localhost",
        "dialect": "postgres"
    },
    "server": {
        "port": 8080,
        "cors": {
            "origin": [
                "http://192.168.0.62:5173",
                "http://localhost:5173"
            ],
            "credentials": true,
            "sameFromRequest":false
        }
    },
    "security": {
        "jwt": {
            "secret": "abc",
            "tokenExpireTime": "48h"
        },
        "prefixLength": 6,
        "sufixLength": 10
    },
    "test": false
}

```

## **FERRAMENTAS**

Todas as ferramentas estão localizadas em `./tools`.

Todos os arquivos `.mjs` são utilizados com `node`

Ex: ```node arquivo.mjs```

### getAllTables.mjs (Linux)

Salva na área de trabalo um arquivo CSV com todos as tabelas registradas. 

### regenerateDatabase.mjs

Regenera todo o banco de dados, é como começar com o banco de dados em branco e com todas as mudanças escritas na API aplicadas.

### userManager.mjs

Registra ou edita usuários no banco de dados.

