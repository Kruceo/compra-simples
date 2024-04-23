import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";

const blockedTables = ["usuario"]

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function bulkPutRequestHandler(req, res) {
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
    const body = req.body

    /*** @type {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>}*/
    const table = tables[tableName]
    if (!table) return;

    for (const item of body) {

        if (item.id == undefined || item.id == null) {
            res.status(statusCodes.BadRequest).json({
                error: true,
                message: "Não foi identificado um 'id' válido."
            })
            return
        }
    }

    // Só utilizar o "ID" como seletor
    for (const rawitem of body) {
        const item = await table.findByPk(rawitem.id)
        if (!item)
            return res.status(statusCodes.BadRequest)
                .json({ error: true, message: "O item especificado não existe." })

        try {
            await item.update(rawitem)
            // res.json({ data, message: "O item foi atualizado com sucesso." })
        } catch (error) {
            return res.status(statusCodes.InternalServerError)
                .json({ error: true, message: "Houve um erro de SQL: " + error })
        }
    }
    res.json({ error: false, message: "Todos os itens foram atualizados com sucesso." })
}