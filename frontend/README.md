# Frontend

## Configuração

Toda configuração básica necessária está localizada em config.json.

Exemplo:

```json
{
  "api_address": "192.168.0.62",
  "api_protocol": "http",
  "api_port": 8080,
  "printer": {
      "address": "192.168.0.62",
      "protocol": "http",
      "port": 8888
  }
}
```

## Configuração da Impressora

A configuração da impressora é para o servidor [kruceo/thermal-printer](https://github.com/kruceo/thermal-printer), que pode ser executado com docker.

# Teste

```bash
npm run dev
```

# Construção

Uma vez que a construção esteja completa, a configuração é estática.

```bash
npm i
npm run build
cd dist
```

# Docker Container Setup

## Rapido

```bash
git clone https://github.com/Kruceo/easyfish.git
cd easyfish/frontend
docker build -t easyfish-frontend .
docker run -p 80:80 easyfish-frontend
```

## Completo

```bash
docker run -p 80:80 \
-e DOMAIN=192.168.0.12
-e API_ADDRESS=192.168.0.11 \
-e API_PORT=8080 \
-e API_PROTOCOL=http \
-e PRINTER_ADDRESS=192.168.0.10 \
-e PRINTER_PORT=8888 \
-e PRINTER_PROTOCOL=http \
-v /home/user/server_files:/var/www
easyfish-frontend
```