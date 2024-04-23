import { where } from "sequelize"
import tables from "../../database/tables.mjs"
import statusCodes from "../../utils/statusCode.mjs"
import { upperCaseLetter } from "../../utils/stringUtils.mjs"

const blockedTables = ["usuario"]

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function bulkDeleteRequestHandler(req, res) {
    if (!Array.isArray(req.body)) {
        return res.status(statusCodes.BadRequest).json({ error: true, message: "Esse endereço só aceita listas." })
    }
    if (blockedTables.includes(req.params.table.toLowerCase())) {
        res.status(statusCodes.ServiceUnavailable).json({
            error: true,
            message: "Caminho bloqueado."
        })
    }

    const tableName = upperCaseLetter(req.params.table, 0)

    /**@type {typeof tables.Bote} */
    const table = tables[tableName]
    if (!table) return;


    try {
        await table.destroy({
            where: {
                id: req.body
            }
        })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }


    res.json({ message: "Os itens foram removidos com sucesso." })
}