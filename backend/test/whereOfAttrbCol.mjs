import { Transacao, Usuario } from "../src/database/tables.mjs";
import sequelize, { Op, col } from 'sequelize'
const s = await Transacao.findAll({
    include: [{
        model: Usuario,
    }],
    where: {
        "$usuario.nome$": {
            [Op.eq]: "rafael"
        }
    }
})

console.log(s.map(each => {
    each = each.dataValues
    each.usuario = each.usuario.nome
    return each
}))