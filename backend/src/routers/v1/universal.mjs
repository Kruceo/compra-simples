import { Router } from "express";
import tables, { Bote } from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import opBuilder from "../../utils/operatorBuilder.mjs";
import orderingBuilder from "../../utils/orderingBuilder.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";
import { getOnlyNecessaryAttributes } from "../../utils/tableUtils.mjs";

/**
 * @type {Router}
 */
const universalRouter = new Router()
const permitedTables = [
    "bote", "fornecedor", "produto", "entrada", "entrada_item"
]
const databaseProtectionMiddleware = (req, res, next) => {
    const path = req.originalUrl.includes("usuario")
    if (path)
        return res.status(statusCodes.NotImplemented).json({
            error: true,
            message: "Essa rota não é permitida"
        })
    next()
}

universalRouter.use(databaseProtectionMiddleware)

universalRouter.get(`/:table`, async (req, res) => {
    const tableName = upperCaseLetter(req.params.table, 0)
    const { limit, include, order, ...restQuery } = req.query

    var whereClause = {}

    Object.keys(restQuery).forEach(each => {
        whereClause[each] = opBuilder(restQuery[each])
    })

    var orderClause = []
    if (order)
        orderClause.push(orderingBuilder(order))

    try {
        const data = await tables[tableName].findAll({
            where: whereClause,
            limit: limit,
            include: tables[include],
            order: orderClause
        })
        res.json({ data })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
})


universalRouter.post(`/:table`, async (req, res) => {

    const tableName = upperCaseLetter(req.params.table, 0)
    const body = req.body
    const table = tables[tableName]
    if (!table) return;
    const tableAttributes = getOnlyNecessaryAttributes(table)
    const content = {}

    //Check and pass to content the attributes 

    for (const attr of tableAttributes) {
        if (!body[attr])
            return res.status(statusCodes.BadRequest)
                .json({
                    error: true, message: "O campo '" + attr + "' não foi preenchido."
                })
        content[attr] = body[attr]
    }

    const data = await table.create(content)

    res.json({ data, message: "O item foi criado com sucesso." })
})

universalRouter.delete(`/:table/:id`, async (req, res) => {
    const tableName = upperCaseLetter(req.params.table, 0)
    const id = req.params.id
    // Só utilizar o "ID" como seletor
    if (!id)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"id\" não foi preenchido." })

    const item = await tables[tableName].findOne({ where: { id: id } })

    if (!item)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O item especificado não existe." })

    try {
        await item.destroy()
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }

    res.json({ message: "O item foi removido com sucesso." })
})

universalRouter.put(`/:table/:id`, async (req, res) => {
    const tableName = upperCaseLetter(req.params.table, 0)
    const id = req.params.id
    const body = req.body
    const table = tables[tableName]
    if (!table) return;
    const tableAttributes = getOnlyNecessaryAttributes(table)
    const content = {}

    //Check and pass to content the attributes 

    for (const attr of tableAttributes) {
        if (!body[attr])
            return res.status(statusCodes.BadRequest)
                .json({
                    error: true, message: "O campo '" + attr + "' não foi preenchido."
                })
        content[attr] = body[attr]
    }

    // Só utilizar o "ID" como seletor
    if (!id)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"id\" não foi preenchido." })

    const item = await table.findOne({ where: { id: id } })

    if (!item)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O item especificado não existe." })

    try {
        const data = await item.update(content)
        res.json({ data, message: "O item foi atualizado com sucesso." })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
})

export default universalRouter