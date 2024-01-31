import tables, { Usuario } from "../src/database/tables.mjs";
import fs from 'fs'
import path from 'path'
import cp from 'child_process'
import { getOnlyNecessaryAttributes } from "../src/utils/tableUtils.mjs";

let columns = []

for (const table of Object.entries(tables)) {
    let column = [table[1].tableName]

    Object.values(table[1].getAttributes()).filter((each) => { return each }).map(each => each.field).forEach(each => column.push(each))
    columns.push(column)
}

let lengthI = 32
let lengthX = 32

let text = ''
for (let i = 0; i < lengthX; i++) {
    for (let x = 0; x < lengthI; x++) {
        if (columns[x] && columns[x][i])
            text += (columns[x][i]) + ' ,'
        else text += " ,"

    }
    text += "X\n"
}
const user = cp.execSync("whoami").toString().replaceAll("\n", "")
console.log(columns[3])
fs.writeFileSync(path.resolve(`/home/${user}/Área de trabalho/csv.csv`), text)