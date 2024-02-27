import tables from "../database/tables.mjs";
import { upperCaseLetter } from "./stringUtils.mjs";
import { getAssociatedModels } from "./tableUtils.mjs";

const blockedAttributes = ['senha', 'password', 'pass', 'pwd']

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
    if (!query || query.trim() == '') return []
    //Escondo as virgulas dentro dos colchetes e chaves "[]{}" trocando as por "%" para que detecte apenas a camada externa de itens, por assim dizer
    //sou obrigado a usar replace nos {} que estão dentro de outros {}, embora não seja o objetivo
    let hiddedQuery = query
        .replace(/{[^{}]*}/g, (s) => s.replace(/,/g, "%").replace(/{/g, "$1").replace(/}/g, "$2"))
        .replace(/\[[^\[\]]*\]*/, (s)=> s.replace(',','%'))

    while (hiddedQuery.includes("{")) {
        hiddedQuery = hiddedQuery
            .replace(/{[^{}]*}/g, (s) => s.replace(/,/g, "%").replace(/{/g, "$1").replace(/}/g, "$2"))
            .replace(/{[^{}]*}/g, (s) => s.replace(",", "%"))
    }
    // replace all $1 and $2 to {} again
    hiddedQuery = hiddedQuery.replace(/\$1/g, '{').replace(/\$2/g, "}")

    console.log(hiddedQuery)

    return hiddedQuery.split(',').map(each => {
        let include = []

        //retiro o conteudo dentro dos colchetes se necessario e também faço da primeira letra maiuscula
        const realname = each.replace(/\[.*?\]/g, "").replace(/{.*?}/g, "")
        const name = upperCaseLetter(realname, 0)
        //capturo tambem o conteudo de dentro dos chaves se houver

        //preciso usar o replace para conseguir o primeiro e mais curto padrão [.+] mesmo que tenha, e reponho as virgulas por que se não é impossivel que a tabela tenha o atributo com o % no meio
        const attrQueryMatch = each.replace("%", ',').match(new RegExp(`(?<=${realname}\\[).*?(?=\\])`)) ?? []
        const includeQueryMatch = each.match(/(?<={).+(?=})/)
        const model = tables[name]

        if (!model) return

        const tableAttributes = Object.keys(model.getAttributes()).filter(attr => {
            if (blockedAttributes.includes(attr)) {
                return null
            }
            if (attrQueryMatch[0] === undefined) {
                return attr
            }
            else if (attrQueryMatch[0].split(',').includes(attr)) {
                return attr
            }
        })

        if (each.includes("{") && includeQueryMatch) {
            //troco todos os "%" por "," novamente para que eu possa chamar a funcção de forma recursiva
            const includeQuery = includeQueryMatch[0].replace("%", ",")
            include = includeBuilder(includeQuery)
        }
        return { model, __model_name: name, include, attributes: tableAttributes }
    })
}

