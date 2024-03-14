import includeBuilder from "../src/utils/includeBuilder.mjs"

const data1 = "transacao{bote{fornecedor}}"
const res1 = includeBuilder(data1)

const data2 = "transacao{bote}"
const res2 = includeBuilder(data2)

const data3 = "transacao[]{bote[]},produto[]{transacao_item[]}"
const res3 = includeBuilder(data3)
console.log(JSON.stringify([res3], ' ', 2))