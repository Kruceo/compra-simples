import { table } from 'console'
import tables, { Usuario } from '../src/database/tables.mjs'
import fs from 'fs'
let file = ""
let allTableNames = ""
let allTableTypes = ""
Object.keys(tables).forEach((tableName) => {
    const table = tables[tableName]
    const interfaceName = table.name.replace(/_/g, '')
    allTableNames += '"' + table.name + '"|'
    allTableTypes += interfaceName + 'Props|'
    file += "interface " + interfaceName + "Props {\n"
    console.log(table)
    Object.entries(table.getAttributes()).forEach(each => {
        let type = "any"
        switch (each[1].type.key) {
            case "STRING":
                type = "string"
                break;
            case "INTEGER":
                type = "number"
                break;
            case "FLOAT":
                type = "number"
                break;
            case "BOOLEAN":
                type = "0|1"
                break;
            case "DATE":
                type = "string"
                break;
            default:
                break;
        }

        file += each[0] + ':' + type + "\n"
    })

    Object.entries(table.associations).forEach(each => {
        let model = (each[1].target.options.name.singular + "Props").replace("_", "")
        if (each[1].associationType == "HasMany") {
            file += each[1].target.options.name.plural + "?:" + model + "[]\n"
        }
        else {
            file += each[1].target.options.name.singular + "?:" + model + "\n"
        }
    })
    // console.log(Usuario.associations.transacoes.associationType)
    // console.log(Usuario.associations.transacoes.target.options.name.plural)

    file += "\n}\n"
})


file += "type allTableNames = " + allTableNames.slice(0, allTableNames.length - 1) + "\n"
file += "type allTableTypes = " + allTableTypes.slice(0, allTableTypes.length - 1) + "\n"





fs.writeFileSync("interfaces.ts", file)
