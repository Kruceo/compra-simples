# ENDPOINTS

## **SUMÁRIO**

- [**METODO GET - OBTER**](#metodo-get---obter)
  - [Obtendo todos](#obtendo-todos)
  - [Filtragem de valor exato](#filtragem-de-valor-exato)
  - [Filtragem de valor parcial](#filtragem-de-valor-parcial)
  - [Filtragem de valor parcial com outras condições](#filtragem-de-valor-parcial-com-outras-condições)
  - [Filtragem por comparação maior ou menor](#filtragem-por-comparação-maior-ou-menor)
  - [Filtragem por intervalo de valores](#filtragem-por-intervalo-de-valores)
  - [Ordenação dos resultados](#ordenação-dos-resultados)
  - [Limitação do número de resultados](#limitação-do-número-de-resultados)
  - [Inclusão de tabelas relacionadas](#inclusão-de-tabelas-relacionadas)
  - [Inclusão de cadeia de tabelas relacionadas](#inclusão-de-cadeia-de-tabelas-relacionadas)
  - [Inclusão de tabelas com atributos limitados](#inclusão-de-tabelas-com-atributos-limitados)
  - [Colunas personalizadas](#colunas-personalizadas)
  - [Agrupamento, funções e inclusão](#agrupamento-funções-e-inclusão)
- [**METODO POST - CRIAR**](#metodo-post---criar)
  - [Criação de um novo item](#criação-de-um-novo-item)
  - [Criação de varios itens](#criação-de-varios-itens)
- [**METODO PUT - ATUALIZAR**](#metodo-put---atualizar)
  - [Edição de um item](#edição-de-um-item)
- [**METODO DELETE - REMOVER**](#metodo-delete---remover)
  - [Remoção de um item](#remoção-de-um-item)
- [**RESPOSTAS DA API**](#respostas-da-api)
## **METODO GET - OBTER**

### Obtendo Todos

```GET /:table/```

Recupera todos os itens da tabela especificada.


<br/>

### Filtragem de valor exato

```GET /:table?nome=juvenal```

Recupera os resultados que possuem o nome "juvenal".


<br/>

### Filtragem de valor parcial

```GET /:table?nome=^r```

Recupera os resultados que possuem o nome que contenha a letra "r".


<br/>

### Filtragem de valor parcial com outras condições

```GET /:table?nome=^r&fornecedor_id=10```

Recupera os resultados que possuem o nome que contenha a letra "r" e têm o fornecedor_id igual a 10.


<br/>

### Filtragem por comparação maior ou menor

```GET /:table?id=>10```

Recupera os resultados com o id maior que 10.

```GET /:table?id=<10```

Recupera os resultados com o id menor que 10.

<br/>


### Filtragem por intervalo de valores

```GET /:table?id=>10,<15```

Recupera os resultados com o id maior que 10 e menor que 15.


<br/>

### Ordenação dos resultados

```GET /:table?order=id,DESC```

Ordena os resultados em ordem decrescente de id. Funciona também com datas no formato ISO.


<br/>

### Limitação do número de resultados

```GET /:table?limit=10```

Limita os resultados a 10 itens.


<br/>

### Inclusão de tabelas relacionadas

```GET /:table?include=fornecedor```

Recupera os resultados incluindo os fornecedores ligados a cada item.


<br/>

### Inclusão de cadeia de tabelas relacionadas

```GET /:table?include=table1,table2{table3{table4,table5}}```

Recupera os resultados incluindo uma cadeia de várias outras tabelas ligadas.

<br/>

### Inclusão de tabelas com atributos limitados

```GET /:table?include=table1[attr1,attr2]{table2[attr3]}```

Recupera os resultados incluindo suas tabelas mas apenas com os atributos desejados.

<br/>

### Colunas personalizadas

```GET /:table?attributes=attr1,attr2```

Recupera os resultados incluindo apenas os atributos desejados.
Pesquisas envolvendo _attributes_ sempre serão retornados em modo **RAW**.

<br/>

### Agrupamento, funções e inclusão

```GET /:table?attributes=attr1.preco,(sum)attr.child.valor&include=child&group=preco```

Recupera os resultados agrupando e somando valores de acordo com a query.

<br/>

## **METODO POST - CRIAR**

### Criação de um novo item

```POST /:table```

Cria um novo item na tabela desejada. Os argumentos devem ser enviados no corpo da requisição, por exemplo: 

```json
{ 
    "nome": "Camarão", 
    "preco": 10.55 
}
```

<br/>

### Criação de varios itens

```POST /:table```

Cria varios novos itens na tabela desejada. Os argumentos devem ser enviados no corpo da requisição em formato de `array`, por exemplo: 

```json
[
    { 
    "nome": "Camarão", 
    "preco": 10.55 
    },
    { 
    "nome": "Polvo", 
    "preco": 8.25 
    }
]
```



## **METODO PUT - ATUALIZAR**

### Edição de um item

```PUT /:table/:id```

Edita um item da tabela especificada pelo id fornecido. Os argumentos devem ser enviados no corpo da requisição, por exemplo: 

```json
{ 
    "nome": "Camarão",
    "preco": 10.55 
}
```

<br/>

## **METODO DELETE - REMOVER**

### Remoção de um item

```DELETE /:table/:id```

Deleta o item desejado da tabela especificada pelo id.

<br/>

## **RESPOSTAS DA API**

Respostas vindas diretamente da API tendem a vir nesse formato:

```typescript
{
    error:boolean,
    message:string,
    data:Object
}
```