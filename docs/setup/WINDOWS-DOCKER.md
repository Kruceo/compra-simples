# Windows + Docker

Guia para instalação em um ambiente Windows junto do Docker Desktop

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Motor e gerênciador de containers
- [Git](https://git-scm.com/) - Ferramenta para gerir repositórios
- [usbipd-win 4.2.0](https://github.com/dorssel/usbipd-win/releases) - Ferramenta para compartilhar dispositivos USB entre o Host e WSL

## Instalação

Partindo do pressuposto que você já tem o `Docker Desktop`, `Git` e `usbipd-win` instalado e configurado:

### Passo 1 - Repositório

Clone o repositório do github e o acesse:

```powershell
git clone https://github.com/Kruceo/easyfish.git
cd easyfish
```

### Passo 2 - Configuração do projeto

Configure o projeto da maneira que preferir editando o arquivo `docker-compose.yml`, talvez seja necessário certo conhecimento sobre a ferramenta *Docker Compose*.

### Passo 3 - Compartilhar dispositivos USB

O Docker Desktop (Windows), diferente do Linux, não tem acesso direto aos dispositivos USB do Host.

Nessa etapa, o `Docker Desktop` já deve estar em execução. Talvez você precise de previlégios de Administrador para continuar.

Listar dispositivos USB conectados ao computador:

```powershell
usbipd list
```

Exemplo de saída:

```powershell
BUSID   VID:PID     DEVICE                      STATE
3-1     03da:ab41   USB Printing Support        Not attached
```

Estamos procurando por uma impressora térmica, esses dispositivos geralmente são listados como `Printing Support` ou `Suporte para Impressão` dependendo da linguagem do sistema, encontre o dispositivo desejado e anote o valor de `VID:PID`.

Agora com o valor já anotado, vamos compartilhar e anexar o dispositivo ao WSL:

```powershell
usbipd bind --hardware-id <VID:PID>
```

```powershell 
usbipd attach --wsl --hardware-id <VID:PID>
```

#### Dicas

Você pode conferir se o dispositivo foi passado corretamente à distribuição WSL utilizando ferramentas como `lsusb` (usbutils).

#### Nota:

Essa etapa é necessária para o funcionamento da impressora térmica junto do sistema. Se você não precisa de uma impressora termica, desative ou remova do arquivo `docker-compose.yml` a parte da impressora, geralmente chamada de `thermal` 

### Passo 3 - Build e Início

Com um simples comando ele vai compilar em imagens Docker e iniciar todos simultaneamente e conectados. 

```powershell
docker compose up
```

### Automatizar Compartilhamento USB (Opcional)

Com ajuda de alguns scripts é possivel automatizar e iniciar o USBIP-WIN junto do Windows.

Você pode seguir os passos descritos [**aqui**](https://github.com/Kruceo/usbipd-at-startup).