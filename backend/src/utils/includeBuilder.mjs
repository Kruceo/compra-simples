import tables from "../database/tables.mjs";
import { upperCaseLetter } from "./stringUtils.mjs";
import { getReferenciedModels } from "./tableUtils.mjs";

const blockedAttributes = ['senha', 'password', 'pass', 'pwd',"obs"]

/**
 * Automatic create a include clause with all references included
 * @param {import("sequelize").ModelStatic<Model<any, any>>} table 
 * @returns {{model: any;include: {model: any;};}[]}
 */

export default function includeBuilder(table) {
    const references = getReferenciedModels(table)

    const includes = references.map(each => {

        const tableName = upperCaseLetter(each.name, 0)

        const table = tables[tableName]

        // filter blocked table attributes 
        const tableAttributes = Object.keys(table.getAttributes()).filter(each => !blockedAttributes.includes(each))
        
        return {
            model: table,
            include: includeBuilder(table),
            attributes: tableAttributes
        }
    })

    return includes.filter(each => each != null)

}