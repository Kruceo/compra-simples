import readline from 'readline'
import tables, { Usuario } from '../src/database/tables.mjs';
import { encrypt } from '../src/security/encrypt.mjs';
import process from 'process';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const option = await getUserInput("0 - Criar\n1 - Editar\n2 - Sair\nEscolha uma opção: ")

if (option == '0') {
    console.log("\n---[Criação de Usuario]---")
    await createUser()
}
if (option == '1') {
    console.log("\n---[Edição de Usuario]---")
    await editUser()
}

process.exit()

async function editUser() {
    const option = await getUserInput("Pesquisar por:\n0 - ID\n1 - Nome de Usuário\nResposta: ")

    const search = await getUserInput("Alvo: ")

    const where = {}
    if (option == '0') where['id'] = search
    if (option == '1') where['nome'] = search
    else return;
    const user = await Usuario.findOne({
        where
    })
    if (!user) return console.log("O usuário não foi encontrado.")
    console.log("Usuário encontrado!")
    const username = await getUserInput("Nome de usuário: ")
    const password = await getUserInput("Senha: ")

    await user.update({
        nome: username,
        senha: encrypt(password)
    })

    console.log(user.dataValues)
}

async function createUser() {
    const username = await getUserInput("Nome: ")

    const password = await getUserInput("Senha: ")

    const usuario = await tables.Usuario.create({
        nome: username,
        senha: encrypt(password)
    })

    console.log(usuario.dataValues)
}

function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}