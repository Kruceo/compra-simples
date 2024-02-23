import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import sequelize from 'sequelize'
import { upperCaseLetter } from "../../utils/stringUtils.mjs";

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function reportRequestHandler(req, res) {
    const tablename = upperCaseLetter(req.params.table, 0)
    const table = tables[tablename]
    const result = await table.findAll({
        attributes: [
            'preco', // Coluna que queremos agrupar
            [sequelize.fn('SUM', sequelize.col('valor_total')), 'total_valor'] // Soma os valor_total para cada preço
        ],
        group: ['preco'], // Agrupa pelo preço
        raw: true, // Retorna os dados crus (objetos planos) sem instâncias de modelos
    })

    res.json(result)
}