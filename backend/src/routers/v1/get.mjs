import tables from "../../database/tables.mjs"
import attributeBuilder from "../../utils/attributeBuilder.mjs"
import groupBuilder from "../../utils/groupBuilder.mjs"
import includeBuilder from "../../utils/includeBuilder.mjs"
import opBuilder from "../../utils/operatorBuilder.mjs"
import orderingBuilder from "../../utils/orderingBuilder.mjs"
import statusCodes from "../../utils/statusCode.mjs"
import { upperCaseLetter } from "../../utils/stringUtils.mjs"

const hidden = ["usuarios", "users", "usr"]

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function getRequestHandler(req, res) {

    const tableName = upperCaseLetter(req.params.table, 0)

    let { limit, order, include, attributes, group, ...restQuery } = req.query

    var whereClause = {}

    // Operator clause build , any like the symbol ">2" turns to [Op.gt]:2
    Object.keys(restQuery).forEach(each => {
        let newKey = each
        // case includes "." add $attr$, to get and compare attributes of included tables
        if (each.includes(".")) newKey = `$${each}$`
        whereClause[newKey] = opBuilder(restQuery[each])
    })

    //Ordering clause build, any like ["id","ASC"] or [LiteralTable,"id","DESC"]
    let orderClause = []
    if (order) orderClause.push(orderingBuilder(order))

    //group is like: ['car.name','car.price']
    let groupClause = groupBuilder(group)

    //attributes uses fn.col or fn.sum //url example:  attributes=teste.nome,(sum)teste.price
    let attributesClause = attributeBuilder(attributes)

    let raw = false
    if (attributes) raw = true;
    let fullClause = {
        where: whereClause,
        attributes: attributesClause,
        group: groupClause,
        limit: limit,
        include: includeBuilder(include),
        order: orderClause,
        raw
    }
        ; (await import("fs")).writeFileSync("last.json", JSON.stringify(fullClause, null, 2))

    try {
        const data = await tables[tableName].findAll(fullClause)
        res.json({ data })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
}