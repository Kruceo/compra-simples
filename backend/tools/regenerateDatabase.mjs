import readline from 'readline'
import cfg from "../config/config.json" assert { type: "json" }
import { Op, Sequelize } from "sequelize";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('\n'.repeat(50));
console.log("ATENÇÃO".padEnd(process.stdout.getWindowSize()[0] / 2 + 7, '-').padStart(process.stdout.getWindowSize()[0], '-'))
console.log("Usar essa ferramenta resultará em perda permanente dos dados contidos na base de dados.")
console.log("Faça um backup de todos os dados importantes, não haverá outra chance.")
console.log("".padEnd(process.stdout.getWindowSize()[0] / 2 + 7, '-').padStart(process.stdout.getWindowSize()[0], '-') + "\n")



const userAcceptedCLI = process.argv.includes("-y")
if (!userAcceptedCLI) {
    console.log("Deseja mesmo continuar? [sim,nao]")
    const userResponse = await getUserInput()
    if (userResponse.trim() != 'sim') {
        console.log("Operação abortada!")
        process.exit()
    }
}

const dbserver = new Sequelize({
    // database: cfg.database.database,
    // schema:   cfg.database.schema,
    host: cfg.database.host,
    password: cfg.database.password,
    username: cfg.database.username,
    dialect: cfg.database.dialect,
    logging: false
});

console.log("Criando esquema...")
await dbserver.query(`CREATE SCHEMA IF NOT EXISTS ${cfg.database.schema};`);

const tables = await import("../src/database/tables.mjs")

for (const table of Object.entries(tables).reverse()) {
    if (table[0] == "default") continue;
    await table[1].destroy({
        where: {
            id: {
                [Op.gt]: 0
            }
        }
    })
    console.log(`Sincronizando ${table[0]}`)
    await table[1].sync({ force: true })
}

function getUserInput() {
    return new Promise((resolve) => {
        rl.question('R: ', (answer) => {
            resolve(answer);
        });
    });
}

process.exit()