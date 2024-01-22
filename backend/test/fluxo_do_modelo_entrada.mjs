import {Bote,Entrada,Entrada_item,Fornecedor,Produto,Usuario} from "../src/database/tables.mjs";

// 0 - criação de um usuario que pode administrar o sistema 

const usuario = await Usuario.create({
    nome:"Testador",
    senha:"definitivamenteumteste"
})

// 1 - precisa haver um bote ao menos 

const bote = await Bote.create({
    nome:"Teste da Maré"
})

// 2 - precisa haver um fornecedor 

const fornecedor = await Fornecedor.create({
    nome:"Fernando Testão",
    bote_id:bote.dataValues.id,
})

// 3 - cadastrar produtos ~ todos os valores são falsos e usados apenas em testes automaticos 
const produto1 = await Produto.create({
    nome:"Camarao 7B",
    preco:20.9, // ~ R$20,90
})
const produto2 = await Produto.create({
    nome:"Camarao Vermelho",
    preco:60.5, // ~ R$60,50
})
const produto3 = await Produto.create({
    nome:"Gelo", //Gelo geralmente é um desconto na finalização
    preco:10.5, // ~ R$10,50
})

// 4 - criando entrada 

const entrada = await Entrada.create({
    data:new Date(),
    obs:"Teste",
    status:0,
    fornecedor_id:fornecedor.dataValues.id,
    bote_id:fornecedor.dataValues.bote_id,
    usuario_id:usuario.dataValues.id
})

// 5 - criando itens para essa entrada

const item1 = await Entrada_item.create({
    peso:2220.0,
    preco:produto1.dataValues.preco - 1, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id:produto1.dataValues.id,
    entrada_id:entrada.dataValues.id,
})

const item2 = await Entrada_item.create({
    peso:22330.0,
    preco:produto2.dataValues.preco - 5, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id:produto1.dataValues.id,
    entrada_id:entrada.dataValues.id,
})

const item3 = await Entrada_item.create({
    peso:2430.0,
    preco:produto3.dataValues.preco -0.5, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id:produto3.dataValues.id,
    entrada_id:entrada.dataValues.id,
    desconto:true                          // desconto coloca o produto de maneira que diminuirá o valor final enves de aumentar, 
})