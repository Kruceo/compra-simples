import tables, { Usuario } from "../src/database/tables.mjs";
import fs from 'fs'
import path from 'path'
import cp from 'child_process'
import { getOnlyNecessaryAttributes } from "../src/utils/tableUtils.mjs";

let columns = []

for (const table of Object.entries(tables)) {
    let column = [table[1].tableName]

    getOnlyNecessaryAttributes(table[1]).forEach(each => {
        column.push(each)
    })
    column.push("createdAt","updatedAt")
    columns.push(column)
}

let lengthI = columns.length
let lengthX = (()=>{
    let max = 0
    columns.forEach(each=>{
        if(each.length > max)max = each.length
    })
    return max
})()

let text = ''
for (let i = 0; i < lengthX; i++) {
    for (let x = 0; x < lengthI; x++) {
        if(columns[x]&&columns[x][i])
        text += (columns[x][i]) + ' ,'
        else text += " ,"
        
    }
    text+="X\n"
}
text += "createdAt,createdAt,createdAt,createdAt,createdAt,createdAt,createdAt,createdAt,createdAt,createdAt\n"
text += "updatedAt,updatedAt,updatedAt,updatedAt,updatedAt,updatedAt,updatedAt,updatedAt,updatedAt,updatedAt\n"

const user = cp.execSync("whoami").toString().replaceAll("\n","")
console.log(columns[3])
fs.writeFileSync(path.resolve(`/home/${user}/Área de trabalho/csv.csv`),text)