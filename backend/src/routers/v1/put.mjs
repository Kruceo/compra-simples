import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";

const blockedTables = ["usuario",'user','usuarios','users']

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function putRequestHandler(req, res) {
    if (blockedTables.includes(req.params.table.toLowerCase())) {
        res.status(statusCodes.ServiceUnavailable).json({
            error: true,
            message: "Caminho bloqueado."
        })
    }
    const tableName = upperCaseLetter(req.params.table, 0)
    const id = req.params.id
    const body = req.body

    const table = tables[tableName]
    if (!table) return;

    // Só utilizar o "ID" como seletor
    if (!id)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"id\" não foi preenchido." })

    try {
        const data = await table.update(body, { where: { id: id } })
        res.json({ data, message: "O item foi atualizado com sucesso." })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
}