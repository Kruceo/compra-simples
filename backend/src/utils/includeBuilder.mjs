import tables from "../database/tables.mjs";
import { upperCaseLetter } from "./stringUtils.mjs";
import { getAssociatedModels } from "./tableUtils.mjs";

const blockedAttributes = ['senha', 'password', 'pass', 'pwd', "obs"]

/**
 * Automatic create a include clause with all references included
 * @param {import("sequelize").ModelStatic<Model<any, any>>} table 
 * @param {string|undefined} parentTableName 
 * @returns {{model: any;include: {model: any;};attributes:string[]}[]}
 */

export function includeAll(table, parentTableName) {
    const associations = getAssociatedModels(table)
    const includes = associations.map(association => {
        if (association.model.name == parentTableName) return;
        // filter blocked table attributes 
        const tableAttributes = Object.keys(association.model.getAttributes()).filter(each => !blockedAttributes.includes(each))

        return {
            model: association.model,
            include: includeBuilder(association.model, table.name),
            attributes: tableAttributes
        }
    })

    return includes.filter(each => each != null)

}

const spliter = ','
const subSpliter = ':'

/**
 * @param {import("sequelize").ModelStatic<Model<any, any>>} table 
 * @param {string} query 
 * @returns 
 */
export default function includeBuilder(query) {
    if (!query) return []
    //Escondo as virgulas dentro de dos colchetes "{}" trocando as por "%" para que detecte apenas a camada externa de itens, por assim dizer
    const hiddedQuery = query.replace(/(?<={.*),(?=.*})/, "%")

    return hiddedQuery.split(',').map(each => {
        let include = []

        //retiro o conteudo dentro dos colchetes se necessario e também faço da primeira letra maiuscula
        const name = upperCaseLetter(each.replace(/{.+}/, ""), 0)
        //capturo tambem o conteudo de dentro dos colchetes se houver
        const includeQueryMatch = each.match(/(?<={).+(?=})/)

        const model = tables[name]

        if (!model) return

        if (each.includes("{") && includeQueryMatch) {
            //troco todos os "%" por "," novamente para que eu possa chamar a funcção de forma recursiva
            const includeQuery = includeQueryMatch[0].replace("%", ",")
            include = includeBuilder(includeQuery)
        }
        return { model, include }
    })
}

