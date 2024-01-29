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
    else {
        key = splited[0]
        order = splited[1]
        if (!key || !order) return undefined
        return [key, order]
    }
}