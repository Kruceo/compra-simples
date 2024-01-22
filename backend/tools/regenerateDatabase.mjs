import tables from "../src/database/tables.mjs";
import readline from 'readline'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('\n'.repeat(50));
console.log("ATENÇÃO".padEnd(process.stdout.getWindowSize()[0]/2 +7,'-').padStart(process.stdout.getWindowSize()[0],'-'))
console.log("Usar essa ferramenta resultará em perda permanente dos dados contidos na base de dados.")
console.log("Faça um backup de todos os dados importantes, não haverá outra chance.")
console.log("".padEnd(process.stdout.getWindowSize()[0]/2 +7,'-').padStart(process.stdout.getWindowSize()[0],'-') +"\n")



const userAcceptedCLI = process.argv.includes("-y")
if (!userAcceptedCLI) {
    console.log("Deseja mesmo continuar? [sim,nao]")
    const userResponse = await getUserInput()
    if (userResponse.trim() != 'sim') {
        console.log("Operação abortada!")
        process.exit()
    }
}

for (const table of Object.entries(tables)) {
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