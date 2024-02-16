import { Bote, Fornecedor, Produto } from "../src/database/tables.mjs";

await Fornecedor.bulkCreate([
    {
        nome: "CRVG"
    },
    {
        nome: "Oppenhaimer"
    },
    {
        nome: "Toninho"
    },
    {
        nome: "Pensilvania"
    },
    {
        nome: "Pablo Vegetti"
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
    nome: "Camarão Rosa",
    preco: 22
},
{
    nome: "Lagosta",
    preco: 50.25
},
{
    nome: "Gelo",
    preco: 2.5
},
{
    nome: "Sulfito",
    preco: 7.5
}
])

process.exit()