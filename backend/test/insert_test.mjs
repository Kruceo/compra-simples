import { Bote, Fornecedor, Produto } from "../src/database/tables.mjs";

await Fornecedor.bulkCreate([
    {
        nome: "Vasco da Gama"
    },
    {
        nome: "Fluminense"
    },
    {
        nome: "Portuguesa"
    },
    {
        nome: "Botafogo"
    },
    {
        nome: "Flamengo"
    }])


await Produto.bulkCreate([{
    nome: "Camarão 7 Barbas",
    preco: 10.5
},
{
    nome: "Camarão Vermelho",
    preco: 21.75
},
{
    nome: "Polvo",
    preco: 8
},
{
    nome: "Lagosta",
    preco: 50.25
},
{
    nome: "Gelo",
    preco: 6.5
}
])

process.exit()