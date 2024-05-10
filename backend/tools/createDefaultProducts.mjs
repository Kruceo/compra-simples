import tables from "../src/database/tables.mjs";

tables.Produto.bulkCreate([
    {
        nome: "Camarão 7B",
        preco: 9.50,
        tipo: 0
    },
    {
        nome: "Camarão Branco",
        preco: 8,
        tipo: 0
    },
    {
        nome: "Camarão Vermelho",
        preco: 8,
        tipo: 0
    },
    {
        nome: "Camarão Rosa",
        preco: 12,
        tipo: 0
    },
    {
        nome: "Camarão Cinza",
        preco: 8,
        tipo: 0
    }
])