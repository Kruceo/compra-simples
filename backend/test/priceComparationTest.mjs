// import { Produto, Transacao_item } from "../src/database/tables.mjs";
import sequelize from 'sequelize'
import { Produto, Transacao, Transacao_item } from '../src/database/tables.mjs'

let clause = {
    attributes: [
        [sequelize.col('transacao_itens.produto.nome'), 'nome'],
        [sequelize.col('transacao_itens.preco'), 'preco'],
        [sequelize.fn('SUM', sequelize.col('transacao_itens.peso')), 'peso'],
        [sequelize.fn('SUM', sequelize.col('transacao_itens.valor_total')), 'valor'], // Soma os valor_total para cada preço
    ],
    group: [
        'transacao_itens.produto.nome',
        'transacao_itens.preco'
    ],
    include: [{
        model: Transacao_item,
        // Use o alias correto aqui
        attributes: [],
        include: [{
            model: Produto,
            attributes: []
        }]
    }], // Agrupa pelo preço e nome do produto
    raw: true, // Retorna os dados crus (objetos planos) sem instâncias de modelos
}

    ; (await import("fs")).writeFileSync("lastR.json", JSON.stringify(clause, null, 2))

const result = await Transacao.findAll(clause);

console.log(result)

Object.entries(result[0]).forEach(each=>{
    process.stdout.write(each[0].padEnd(20,' ') + '|')
})
process.stdout.write("\n")


result.forEach(each => {
    let text = ''
    Object.entries(each).forEach(each => {
        if (each[0].includes("."))
            text += ('invalid').padEnd(8, " ") + ','
        else
            text += (each[1] + '').padEnd(20, " ") + ','
    })
    console.log(text)
})
