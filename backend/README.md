# API RESTful

## Como usar a API

### Obtendo todos os itens de uma tabela

Para obter todos os itens de uma tabela, utilize o método GET com o seguinte caminho: /v1/botes.

Exemplo de requisição usando JavaScript com fetch:

```js
const resposta = await fetch('192.168.0.10:8080/v1/botes',{
    method:"GET"
})
const botes = await resposta.json()
```

### Aplicando Filtros

Você pode aplicar filtros aos resultados usando parâmetros de consulta (queries). Os parâmetros disponíveis dependem da tabela selecionada.

Exemplo de requisição com consultas (queries) para filtrar por nome e limitar o número de resultados:

```js
const resposta = await fetch('192.168.0.10:8080/v1/botes?nome=maritimo&limit=20',{
    method:"GET"
})
const botesFiltrados = await resposta.json()
```

Neste exemplo, estamos filtrando "botes" com o nome "maritimo" e limitando os resultados a 20.

### Adicionando, Atualizando e Removendo Itens

Além de obter dados, você pode adicionar, atualizar e remover itens usando os métodos POST, PUT e DELETE.

#### Adicionando um Item

Para adicionar um novo item, use o método POST com o caminho /v1/botes e inclua os dados do novo item no corpo da requisição.

Exemplo usando JavaScript com fetch:

```js
const novoBote = {
    nome: "Novo Bote",
    // Outros campos...
};

const resposta = await fetch('192.168.0.10:8080/v1/botes',{
    method:"POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(novoBote)
});

const novoBoteAdicionado = await resposta.json();
```

#### Atualizando um Item

Para atualizar um item existente, use o método PUT com o caminho /v1/botes/:id, substituindo :id pelo identificador do item que deseja atualizar. Inclua os dados atualizados no corpo da requisição.

Exemplo usando JavaScript com fetch:

```js
const idDoBote = 1;
const dadosAtualizados = {
    nome: "Bote Atualizado",
    // Outros campos...
};

const resposta = await fetch(`192.168.0.10:8080/v1/botes/${idDoBotePara}`,{
    method:"PUT",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosAtualizados)
});

const boteAtualizado = await resposta.json();
```

#### Removendo um Item

Para remover um item, use o método DELETE com o caminho /v1/botes/:id, substituindo :id pelo identificador do item que deseja remover.

Exemplo usando JavaScript com fetch:

```js
const idDoBote = 1;

await fetch(`192.168.0.10:8080/v1/botes/${idDoBote}`,{
    method:"DELETE"
});
```

### Tabelas Disponíveis

As tabelas disponíveis na API estão listadas no arquivo MAPS.md. Certifique-se de consultar essa documentação para obter informações específicas sobre os campos disponíveis e os parâmetros de consulta aplicáveis.

### Considerações Finais

Certifique-se de verificar a documentação atualizada para obter informações detalhadas sobre endpoints adicionais, autenticação e qualquer outra configuração específica da API. Esperamos que esta API atenda às suas necessidades de gerenciamento de "botes" de forma eficiente e fácil de usar. Se
