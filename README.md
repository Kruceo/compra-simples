# Compra Simples

## **DATABASE DOCKER CONTAINER**

Recomendamos utilizar o PostgreSQL em um contêiner Docker para facilitar o gerenciamento e garantir consistência no ambiente de desenvolvimento. Para iniciar um contêiner PostgreSQL, execute o seguinte comando:

```bash
docker run --name nome-do-seu-container -e POSTGRES_PASSWORD=sua-senha -p 5432:5432 -d postgres
```

```bash
docker run --name compras \
    -e DOMAIN="YOURDOMAIN" \
    -e API_ADDRESS="192.168.0.100" \
    -e API_PORT=8080 \
    -e API_PROTOCOL="http" \
    -e PRINTER_ADDRESS="192.168.0.101" \
    -e PRINTER_PORT=8080 \    
    -e PRINTER_PROTOCOL="http" \    
    -p 80:80
    -v /var/www
    rafola/cs-frontend
```

## **BACKEND**

Leia [**BACKEND/README**](https://github.com/Kruceo/compra-simples/tree/main/backend/README.md).

## **FRONTEND**

Leia [**FRONTEND/README**](https://github.com/Kruceo/compra-simples/tree/main/frontend/README.md).