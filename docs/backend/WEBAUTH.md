# WEBAUTH

## **SUMÁRIO**

- [**Autenticação de sessão**](#autenticação-de-sessão)
  - [Login](#login)
  - [Validação](#validação-opcional)


## **AUTENTICAÇÃO DE SESSÃO**

### Login

```POST /auth/login```

Usado para criar sessões no servidor.

BODY:

```ts
{
    user:string,
    password:string
}
```

RESPONSE:

```ts
{
    error:boolean,
    message:string,
    token:string
}
```

Se não houver nenhum ***erro***, a utilização do token deve ser como `HEADER AUTHORIZATION`.

<br/>

### Validação opcional

```GET /auth/validate```

**RESPONSE**:

```typescript
{
    error:boolean,
    message:string,
}
```

Exemplo de uso:

Ao entrar em uma pagina que é destinada apenas para usuários autenticados, é feito uma requisição, se houver erro, o usuário é redirecionado à tela de login.