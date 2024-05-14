# Frontend

## Instalação das Dependências

Antes de executar qualquer comando de desenvolvimento ou build, certifique-se de que todas as dependências do projeto estão instaladas. Para isso, execute:

```bash
# /easyfish/frontend
npm install
```

Este comando instalará todas as dependências listadas no arquivo `package.json`.

## Configuração 

Altere conforme o necessário o arquivo `config.json` levando em conta a [documentação de configuração](./CONFIG.md) 

## Testes

Para iniciar o servidor de desenvolvimento e testar seu aplicativo localmente, utilize o seguinte comando:

```bash
# /easyfish/frontend
npm run dev
```

Este comando iniciará o servidor de desenvolvimento. Normalmente, você poderá acessar o aplicativo no navegador em `http://localhost:5173`, a menos que o projeto esteja configurado para uma porta diferente.

Verifique no terminal se há mensagens de erro ou de sucesso. O servidor deve continuar em execução e recarregar automaticamente as alterações no código.

## Build

Para construir o aplicativo para produção, utilize o comando a seguir:

```bash
# /easyfish/frontend
npm run build
```

Este comando criará uma versão otimizada do aplicativo na pasta `dist`. Certifique-se de que não há erros durante o processo de build.

## Verificação do Build

Para garantir que o build foi gerado corretamente, você pode servir o conteúdo da pasta de build usando um servidor estático simples como o `serve`:

```bash
npx serve -s build
```

Acesse o aplicativo no navegador conforme instruções fornecidas pelo comando acima.
