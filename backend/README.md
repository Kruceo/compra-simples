# Como usar a API

*Usaremos a tabela "botes" como exemplo em todos.

## Obtendo todos os itens de uma tabela.

Usando o metodo **GET**, use o cominho /v1/botes. E.g: `192.168.0.10:8080/v1/botes`

```js
    const resposta = await fetch('192.168.0.10:8080/v1/botes',{
        method:"GET"
    })
    const botes = await resposta.json()
```
