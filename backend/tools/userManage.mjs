import readline from 'readline'
import cfg from "../config/config.json" assert { type: "json" }
import { Sequelize } from "sequelize";
import tables from '../src/database/tables.mjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const username = await getUserInput("Nome: ")

const password = await getUserInput("Senha: ")

const usuario = await tables.Usuario.create({
    nome: username,
    senha: password
})

function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}