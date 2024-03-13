import jsPDF from "jspdf";
import backend from "../../../constants/backend/backend";
import { openPDF, writeHeader, writeTable } from "./libraryReports";
import { getSigles } from "../../../constants/stringUtils";

export async function boatEntryComparation(d1: Date, d2: Date, status: number) {

    const pdf = new jsPDF({ orientation: "landscape" })

    const resTransicao = await backend.get("transacao", {
        include: 'transacao_item[]{produto[]},bote[]{fornecedor[]}',
        attributes: 'bote.nome,bote.fornecedor.nome,transacao_itens.produto.nome,(sum)transacao_itens.valor_total,tipo',
        group: 'bote.nome,bote.fornecedor.nome,transacao_itens.produto.nome,tipo',
        status: status,
        createdAt: ">" + d1.toISOString() + ",<" + d2.toISOString(),
        order: 'bote_nome,ASC'
    })

    if (resTransicao.data.error || !resTransicao.data.data || !Array.isArray(resTransicao.data.data)) return alert('error 001 /boatEntryComparation')

    let prd = resTransicao.data.data.map((each: any) => { return { tipo: each.tipo, produto: each.produto_nome } })
    let prd0 = prd.filter(each => !each.tipo)
    let prd1 = prd.filter(each => each.tipo)
    prd = [...prd0, { produto: "Subtotal", tipo: false }, ...prd1, { produto: "Total Geral", tipo: false }]
    let products = prd.reduce((acum, next) => {
        if (!acum.includes(next.produto) && next.produto)
            return acum + ',' + next.produto
        return acum
    }, '').split(",").slice(1)

    let productsTotals: any = {}

    products.forEach(each => productsTotals[each] = 0)

    let dataTrasacao = resTransicao.data.data.reduce((acum, next: any) => {
        let mo = { ...acum }
        let boatKey = getSigles(next.fornecedor_nome) + ' - ' + next.bote_nome
        if (!mo[boatKey]) {
            mo[boatKey] = {}
            products.forEach((each) => mo[boatKey][each] = 0)
        }
        if (products.includes(next.produto_nome)) {
            mo[boatKey][next.produto_nome] = next.tipo ? -next.transacao_itens_valor_total ?? 0 : next.transacao_itens_valor_total
            productsTotals[next.produto_nome] += next.transacao_itens_valor_total
        }
        if (!mo[boatKey]['Subtotal'])
            mo[boatKey]['Subtotal'] = 0
        mo[boatKey]['Subtotal'] += next.tipo == false ? next.transacao_itens_valor_total : 0
        productsTotals["Subtotal"] += next.tipo == false ? next.transacao_itens_valor_total : 0

        if (!mo[boatKey]['Total Geral'])
            mo[boatKey]['Total Geral'] = 0
        mo[boatKey]['Total Geral'] += next.tipo == false ? next.transacao_itens_valor_total : -next.transacao_itens_valor_total
        productsTotals['Total Geral'] += next.tipo == false ? next.transacao_itens_valor_total : -next.transacao_itens_valor_total
        return mo
    }, {} as any)

    console.log(dataTrasacao)

    const table: string[][] = Object.entries(dataTrasacao).map((each: any) => [each[0], ...Object.values(each[1])])
    table.push(products.map(each=>"-"))
    table.push(["Total", ...Object.values(productsTotals) as string[]])

    const today = new Date()

    let lastBoundingBox = writeHeader(pdf, today.toLocaleDateString().slice(0, 5), d1, d2)

    let tableDispositionOfStyle = ['bold']
    tableDispositionOfStyle[table[0].length - 1] = 'bold'
    tableDispositionOfStyle[products.length - 3] = 'bold'


    console.log(table)

    let fontSize = 100 / products.length

    if (fontSize > 10) fontSize = 10

    pdf.setFontSize(fontSize)

    writeTable(pdf, table, lastBoundingBox.x, lastBoundingBox.y2 + 7, ["Bote", ...getSigles(products)], [2], tableDispositionOfStyle)

    openPDF(pdf)
}

