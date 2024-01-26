import { Router } from "express";
import tables, { Bote } from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import opBuilder from "../../utils/operatorBuilder.mjs";
import orderingBuilder from "../../utils/orderingBuilder.mjs";

/**
 * @type {Router}
 */
const produtoRouter = new Router()

// boteRouter.get(`/bote`, async (req, res) => {
//     const { include,id } = req.query

//     const data = await Bote.findOne({
//         where: { id },
//         include: tables[include]
//     })

//     res.json({ data })
// })

boteRouter.get(`/produto`, async (req, res) => {
    const { nome, id, limit, include, order } = req.query

    var whereClause = {}
    if (id) whereClause.id = opBuilder(id)
    if (nome) whereClause.nome = opBuilder(nome)

    var orderClause = []
    if (order) {
        orderClause.push(orderingBuilder(order))
    }

    const data = await Bote.findAll({
        where: whereClause,
        limit: limit,
        include: tables[include],
        order: orderClause
    })

    res.json({ data })
})


boteRouter.post(`/bote`, async (req, res) => {
    const { nome } = req.body
    if (!nome)
        res
            .status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"nome\" não foi preenchido." })

    const data = await Bote.create({ nome })

    res.json({ data, message: "O item foi criado com sucesso." })
})

boteRouter.delete(`/bote/:id`, async (req, res) => {
    const id = req.params.id
    // Só utilizar o "ID" como seletor
    if (!id)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"id\" não foi preenchido." })

    const bote = await Bote.findOne({ where: { id: id } })

    if (!bote)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O item especificado não existe." })

    try {
        await bote.destroy()
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }

    res.json({ message: "O item foi removido com sucesso." })
})

boteRouter.put(`/bote/:id`, async (req, res) => {
    const id = req.params.id
    const content = req.body
    // Só utilizar o "ID" como seletor
    if (!id)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O campo \"id\" não foi preenchido." })

    const bote = await Bote.findOne({ where: { id: id } })

    if (!bote)
        return res.status(statusCodes.BadRequest)
            .json({ error: true, message: "O item especificado não existe." })

    try {
        const data = await bote.update(content)
        res.json({ data, message: "O item foi atualizado com sucesso." })
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
})

export default boteRouter