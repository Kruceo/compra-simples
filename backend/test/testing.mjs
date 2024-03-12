import '../index.mjs'
import cfg from '../config/config.json' assert {type: "json"}
await wait(0.5)

console.log("Iniciando teste.")

const tests = [
    [{ method: "GET", path: "bote", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "bote?id=f", body: undefined }, { status: 500 }],
    [{ method: "GET", path: "bote?id=000", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "bote?attributes=nome", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "bote?attributes=nome,id", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "transacao?attributes=bote_id,(sum)valor", body: undefined }, { status: 500 }],
    [{ method: "GET", path: "transacao?attributes=bote_id,(console.log('teste'))valor", body: undefined }, { status: 500 }],
    [{ method: "GET", path: "transacao?attributes=bote_id,(sum)valor&group=bote_id", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "transacao?include=bote[]{fornecedor},transacao_item&transacao_itens.id=55", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "transacao?include=bote[nome]{fornecedor},transacao_item&transacao_itens.id=55", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "transacao?include=bote[nome,carro]{fornecedor},transacao_item&transacao_itens.id=55", body: undefined }, { status: 200 }],
    [{ method: "GET", path: "transacao?include=bote[nome]{fornecedor},transacao_item&transacao_item.id=55", body: undefined }, { status: 500 }]
]


for (const test of tests) {
    const { data, status } = await resJson(test[0].method, test[0].path, test[0].body)
    if (status != test[1].status) throw Error(`error at received status(${status}) of ${test[0].method} ${test[0].path}. Expected status = ${test[1].status}`)
}

// const res = await fetch(`http://localhost:${cfg.server.port}`)





async function wait(seconds) { return await new Promise((res) => setTimeout(() => res(), seconds * 1000)) }

async function resJson(method, path, body) {
    let headers = {}
    if (method != 'GET') headers['Content-Type'] = 'application/json'
    const res = await fetch(`http://localhost:${cfg.server.port}/v1/${path}`, { method, headers, body: JSON.stringify(body) })
    const data = await res.json()
    console.log("============" + res.status)
    return { data, status: res.status }
}