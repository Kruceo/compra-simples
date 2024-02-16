import { where } from "sequelize";
import { Bote, Entrada, Entrada_item, Fornecedor, Produto, Usuario } from "../src/database/tables.mjs";

const nomes = ["Joca", "Julina", "Marc", "Mark", "Ferne", "Pedro", "Yuri", "Paolo", "Léo", "Paulo", "Albert", "Cristi", "Lucas", "Dimitri", "David", "Moana", "Ohana", "Marcelo", "Maria", "Rafael", "Don", "Teste"]
const sobrenomes = ["Amorign", "Souza", "Schuznic", "De Souza", "Raul", "Henrique", "Alberto", "Guerreiro", "Vegetti", "Jardim", "Piton", "Payet", "Neres", "Ronaldo"]
const barcoNomes = ["Maré", "Vento", "Onda", "Estrela", "Navegador", "Aurora", "Majestade", "Tranquilidade", "Bruma", "Ventos", "Céu", "Caminho", "Horizonte", "Sereno", "Sonho", "Navegador", "Oásis", "Lua", "Maravilha", "Pérola", "Oceano", "Barco", "Aventura", "Maré", "Nuvem", "Rumo", "Encanto", "Travessia", "Cisne", "Alvorada"];

const barcoSobrenomes = ["Serena", "Livre", "Mágica", "do Mar", "Solitário", "Marítima", "Azul", "Aquática", "Encantada", "da Liberdade", "Náutico", "das Marés", "Infinito", "Marinho", "Náutico", "Audaz", "Marítimo", "Prateada", "Aquática", "dos Mares", "Sereno", "da Fortuna", "Marinha", "de Sorte", "Marítima", "Estelar", "Aquático", "Dourada", "Marinho", "Marítima"];
function getRandomName() {
    return nomes[parseInt(Math.random() * nomes.length)] + " " + sobrenomes[parseInt(Math.random() * sobrenomes.length)]
}
function getRandomBoatName() {
    return barcoNomes[parseInt(Math.random() * barcoNomes.length)] + " " + barcoSobrenomes[parseInt(Math.random() * barcoSobrenomes.length)]
}

// 0 - criação de um usuario que pode administrar o sistema
let vendors = []
for (let i = 0; i < 10; i++) {
    const vendor = await Fornecedor.create({
        nome: getRandomName()
    })
    vendors.push(vendor)
}
