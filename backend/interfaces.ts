interface boteProps {
id:number
fornecedor_id:number
nome:string
createdAt:string
updatedAt:string
fornecedor?:fornecedorProps
transacoes?:transacaoProps[]

}
interface fornecedorProps {
id:number
nome:string
integracao_id:number
createdAt:string
updatedAt:string
botes?:boteProps[]

}
interface produtoProps {
id:number
nome:string
preco:number
createdAt:string
updatedAt:string
transacao_itens?:transacaoitemProps[]

}
interface transacaoProps {
id:number
bote_id:number
usuario_id:number
valor:number
peso:number
obs:string
tipo:0|1
status:number
createdAt:string
updatedAt:string
transacao_itens?:transacaoitemProps[]
bote?:boteProps
usuario?:usuarioProps

}
interface transacaoitemProps {
id:number
produto_id:number
transacao_id:number
peso:number
preco:number
valor_total:number
transacao?:transacaoProps
produto?:produtoProps

}
interface usuarioProps {
id:number
nome:string
senha:string
createdAt:string
updatedAt:string
transacoes?:transacaoProps[]

}
type allTableNames = "bote"|"fornecedor"|"produto"|"transacao"|"transacao_item"|"usuario"
type allTableTypes = boteProps|fornecedorProps|produtoProps|transacaoProps|transacaoitemProps|usuarioProps
