# Linux + Docker

Guia para instalação em um ambiente Linux junto do Docker

## Requisitos

- [Docker](https://www.docker.com/) - Motor e gerênciador de containers
- [Git](https://git-scm.com/) - Ferramenta de repositóios

## Instalação

Partindo do pré suposto que você já tem o `Docker` e também o `Git` instalados e configurados:

### Passo 1 - Repositório

Clone o repositório do github e o acesse:

```bash
git clone https://github.com/Kruceo/easyfish.git
cd easyfish
```

### Passo 2 - Configuração do projeto

Configure o projeto da maneira que preferir editando o arquivo `docker-compose.yml`, talvez seja necessário certo conhecimento sobre a ferramenta *Docker Compose*.

### Passo 3 - Build e Início

Com um simples comando ele vai compilar em imagens Docker e iniciar todos simultaneamente e conectados. 

```bash
docker compose up
```
