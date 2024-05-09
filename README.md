# Compra Simples

## Setup With Docker Compose


```bash
git clone https://github.com/Kruceo/easyfish.git
cd easyfish
docker-compose up
```

### Dicas para o ambiente Windows

O projeto necessita que se passe o dispositivo de impressora USB para o container, usando `Linux` isso é facilmente alcansado, no `Windows`, usando apenas o `Docker Desktop` isso **Não é possivel** até o momento.
Para contornar isso recomendamos o uso do [usbipd-win 4.2.0](https://github.com/dorssel/usbipd-win/releases), junto desses [utilitários](https://github.com/Kruceo/powershell-utils) para iniciar o mesmo automaticamente ao Iniciar do Windows. 

## **BACKEND**

Leia [**BACKEND/README**](https://github.com/Kruceo/compra-simples/tree/main/backend/README.md).

## **FRONTEND**

Leia [**FRONTEND/README**](https://github.com/Kruceo/compra-simples/tree/main/frontend/README.md).