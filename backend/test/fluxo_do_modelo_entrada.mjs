import { where } from "sequelize";
import { Bote, Entrada, Entrada_item, Fornecedor, Produto, Usuario } from "../src/database/tables.mjs";

const nomes = ["Joca", "Julina", "Marc", "Mark", "Ferne", "Pedro", "Yuri", "Paolo", "Léo", "Paulo", "Albert", "Cristi", "Lucas", "Dimitri", "David", "Moana", "Ohana", "Marcelo", "Maria", "Rafael", "Don", "Teste"]
const sobrenomes = ["Amorign", "Souza", "De Souza", "Raul", "Henrique", "Alberto", "Guerreiro", "Vegetti", "Jardim", "Piton", "Payet", "Neres", "Ronaldo"]
const barcoNomes = ["Maré","Vento","Onda","Estrela","Navegador","Aurora","Majestade","Tranquilidade","Bruma","Ventos","Céu","Caminho","Horizonte","Sereno","Sonho","Navegador","Oásis","Lua","Maravilha","Pérola","Oceano","Barco","Aventura","Maré","Nuvem","Rumo","Encanto","Travessia","Cisne","Alvorada"];
  
  const barcoSobrenomes = ["Serena","Livre","Mágica","do Mar","Solitário","Marítima","Azul","Aquática","Encantada","da Liberdade","Náutico","das Marés","Infinito","Marinho","Náutico","Audaz","Marítimo","Prateada","Aquática","dos Mares","Sereno","da Fortuna","Marinha","de Sorte","Marítima","Estelar","Aquático","Dourada","Marinho","Marítima"];
function getRandomName() {
    return nomes[parseInt(Math.random() * nomes.length)] +" "+ sobrenomes[parseInt(Math.random() * sobrenomes.length)]
}
function getRandomBoatName() {
    return barcoNomes[parseInt(Math.random() * barcoNomes.length)] +" "+ barcoSobrenomes[parseInt(Math.random() * barcoSobrenomes.length)]
}

// 0 - criação de um usuario que pode administrar o sistema 

const usuario = (await Usuario.findCreateFind({
    where: {
        nome: "Testador",
        senha: "definitivamenteumteste"
    }
}))[0]

// 1 - precisa haver um bote ao menos 

const bote = await Bote.create({
    nome: getRandomBoatName()
})

// 2 - precisa haver um fornecedor 

const fornecedor = await Fornecedor.create({
    nome: getRandomName(),
    bote_id: bote.dataValues.id,
})

// 3 - cadastrar produtos ~ todos os valores são falsos e usados apenas em testes automaticos 
const produto1 = (await Produto.findCreateFind({
    where: {
        nome: "Camarao 7b",
        preco: 15.5, // ~ R$60,50
    }
}))[0]
const produto2 = (await Produto.findCreateFind({
    where: {
        nome: "Camarao Vermelho",
        preco: 60.5, // ~ R$60,50
    }
}))[0]
const produto3 = (await Produto.findCreateFind({
    where: {
        nome: "Gelo",
        preco: 10.5, // ~ R$60,50
    }
}))[0]

// 4 - criando entrada 

const entrada = await Entrada.create({
    data: new Date(),
    obs: "Teste",
    status: 0,
    fornecedor_id: fornecedor.dataValues.id,
    bote_id: fornecedor.dataValues.bote_id,
    usuario_id: usuario.dataValues.id
})

// 5 - criando itens para essa entrada

const item1 = await Entrada_item.create({
    peso: 2220.0,
    preco: produto1.dataValues.preco - Math.random() * 4, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id: produto1.dataValues.id,
    entrada_id: entrada.dataValues.id,
})

const item2 = await Entrada_item.create({
    peso: 22330.0,
    preco: produto2.dataValues.preco - Math.random() * 5, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id: produto1.dataValues.id,
    entrada_id: entrada.dataValues.id,
})

const item3 = await Entrada_item.create({
    peso: 2430.0,
    preco: produto3.dataValues.preco - Math.random() * 2, //pode ser necessario descontos ou aumentos no preço padrão, por isso a redundancia
    produto_id: produto3.dataValues.id,
    entrada_id: entrada.dataValues.id,
    desconto: true                          // desconto coloca o produto de maneira que diminuirá o valor final enves de aumentar, 
})

process.exit()