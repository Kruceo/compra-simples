import tables from "../../database/tables.mjs"
import includeBuilder from "../../utils/includeBuilder.mjs"
import opBuilder from "../../utils/operatorBuilder.mjs"
import orderingBuilder from "../../utils/orderingBuilder.mjs"
import statusCodes from "../../utils/statusCode.mjs"
import { upperCaseLetter } from "../../utils/stringUtils.mjs"

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function getRequestHandler(req, res) {

    const tableName = upperCaseLetter(req.params.table, 0)
    const { limit, order, include, ...restQuery } = req.query

    var whereClause = {}

    // Operator clause build , any like the symbol ">2" turns to [Op.gt]:2
    Object.keys(restQuery).forEach(each => {
        whereClause[each] = opBuilder(restQuery[each])
    })

    //Ordering clause build, any like ["id","ASC"] or [LiteralTable,"id","DESC"]
    var orderClause = []
    if (order) orderClause.push(orderingBuilder(order))

    try {
        const data = await tables[tableName].findAll({
            where: whereClause,
            limit: limit,
            include: includeBuilder(include),
            order: orderClause
        })
        res.json({ data })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
}