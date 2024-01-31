import { Router } from "express";
import tables, { Bote, Entrada, Entrada_item } from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import opBuilder from "../../utils/operatorBuilder.mjs";
import orderingBuilder from "../../utils/orderingBuilder.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";
import { getOnlyNecessaryAttributes, getReferenciedModels } from "../../utils/tableUtils.mjs";
import includeBuilder from "../../utils/includeBuilder.mjs";
import postRequestHandler from "./post.mjs";
import deleteRequestHandler from "./delete.mjs";
import putRequestHandler from "./put.mjs";
import getRequestHandler from "./get.mjs";

/**
 * @type {Router}
 */
const universalRouter = new Router()
const permitedTables = [
    "bote", "fornecedor", "produto", "entrada", "entrada_item"
]
const databaseProtectionMiddleware = (req, res, next) => {
    console.log(req.method.padEnd(7, ' ') + req.originalUrl.padEnd(20, ' '), req.body)
    const path = req.originalUrl.includes("usuario")
    if (path)
        return res.status(statusCodes.NotImplemented).json({
            error: true,
            message: "Essa rota não é permitida"
        })
    next()
}

universalRouter.use(databaseProtectionMiddleware)

universalRouter.get(`/:table`, getRequestHandler)

universalRouter.post(`/:table`, postRequestHandler)

universalRouter.delete(`/:table/:id`, deleteRequestHandler)

universalRouter.put(`/:table/:id`, putRequestHandler)

export default universalRouter