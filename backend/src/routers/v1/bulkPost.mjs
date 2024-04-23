import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";
import { getOnlyNecessaryAttributes } from "../../utils/tableUtils.mjs";
import { checkAttributes, wipeNoTableAttributes } from "./post.mjs";

const blockedTables = ["usuario"]

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function bulkPostRequestHandler(req, res) {
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
    let body = req.body

    const table = tables[tableName]
    if (!table) return;
    const tableNecessaryAttributes = getOnlyNecessaryAttributes(table)

    for (let i = 0; i < body.length; i++) {
        //get the auth provided user, and put to body (/src/security/authentication.mjs ~ authMiddleware)
        body[i].usuario_id = req.auth.user.id

        //Check the attributes
        if (!checkAttributes(body[i], tableNecessaryAttributes))
            return res.status(statusCodes.BadRequest)
                .json({
                    error: true, message: "Existem campos não preenchidos."
                })

        //Wipe the attributes that can't appears in table 
        body[i] = wipeNoTableAttributes(body[i], table)
    }

    try {
        const data = await table.bulkCreate(body)
        res.json({ data, message: "Os itens foram criados com sucesso." })
        return;
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
}

