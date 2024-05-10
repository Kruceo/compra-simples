# Frontend

## Configuração

Toda configuração básica necessária está localizada em config.json.

Exemplo:

```json
{
"endereco_api": "192.168.0.62",
"protocolo_api": "http",
"porta_api": 8080,
"impressora": {
"endereco": "192.168.0.62",
"protocolo": "http",
"porta": 8888
}
}
```

## Configuração da Impressora

A configuração da impressora é para o servidor [kruceo/thermal-printer](https://github.com/kruceo/thermal-printer), que pode ser executado com docker, utilizando a imagem [rafola/thermal-printer](https://hub.docker.com/r/rafola/thermal-printer).

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