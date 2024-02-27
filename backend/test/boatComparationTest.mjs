// import { Produto, Transacao_item } from "../src/database/tables.mjs";
import sequelize from 'sequelize'
import { Bote, Produto, Transacao, Transacao_item } from '../src/database/tables.mjs'
import includeBuilder from '../src/utils/includeBuilder.mjs'
import groupBuilder from '../src/utils/groupBuilder.mjs'
import attributeBuilder from '../src/utils/attributeBuilder.mjs'
import orderBuilder from '../src/utils/orderingBuilder.mjs'
// import includeBuilder from '../src/utils/groupBuilder.mjs.mjs'
let clause = {
    where:{status:0,tipo:false},
    order:[["bote","ASC"]],
    attributes: [
        [sequelize.col('bote.nome'), 'bote'],
        [sequelize.col('transacao_itens.produto.nome'), 'nome'],
       
        [sequelize.fn('SUM', sequelize.col('transacao_itens.valor_total')), 'valor'],
    ],
    group: [
        'bote.nome',
        'transacao_itens.produto.nome',
    ],
    include: [{
        model: Bote,
        attributes:[]
    },
    {
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

let urlquer = {
    include:'transacao_item[]{produto[]},bote[]',
    attributes:'bote.nome,transacao_itens.produto.nome,(sum)transacao_itens.valor_total,transacao.tipo',
    group:'bote.nome,transacao_itens.produto.nome,tipo',
    where:{status:0,tipo:false},
    order:'bote_nome,ASC'
}


let alt = {
    include:includeBuilder(urlquer.include),
    attributes:attributeBuilder(urlquer.attributes),
    group: groupBuilder(urlquer.group),
    // where:urlquer.where,
    order:[orderBuilder(urlquer.order)]
}

console.log(alt)

// process.exit()











const result = await Transacao.findAll({...alt,raw:true});

console.log(result)

Object.entries(result[0]).forEach(each => {
    process.stdout.write(each[0].padEnd(30, ' ') + '|')
})
process.stdout.write("\n")


result.forEach(each => {
    let text = ''
    Object.entries(each).forEach(each => {
        if (each[0].includes("."))
            text += ('invalid').padEnd(8, " ") + '|'
        else
            text += (each[1] + '').padEnd(30, " ") + '|'
    })
    console.log(text)
})
