import tables from '../database/tables.mjs'
export default function orderingBuilder(query) {
    console.log(query)
    const splited = query.split(",")
    let table = null
    let key = null
    let order = null

    if (splited.length === 3) {
        table = tables[splited[0]]
        key = splited[1]
        order = splited[2]
        if (!key || !order) return undefined
        return [table, key, order]
    }
    if (splited.length === 4) {
        table = tables[splited[0]]
        let table2 = tables[splited[1]]
        key = splited[2]
        order = splited[3]
        if (!key || !order) return undefined
        return [table,table2, key, order]
    }
    else {
        key = splited[0]
        order = splited[1]
        if (!key || !order) return undefined
        return [key, order]
    }
}