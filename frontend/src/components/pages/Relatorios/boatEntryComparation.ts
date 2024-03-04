import jsPDF from "jspdf";
import backend from "../../../constants/backend";
import { openPDF, writeHeader, writeTable } from "./libraryReports";

export async function boatEntryComparation(d1: Date, d2: Date) {

    const pdf = new jsPDF({ orientation: "landscape" })

    const resTransicao = await backend.get("transacao", {
        include: 'transacao_item[]{produto[]},bote[]{fornecedor[]}',
        attributes: 'bote.nome,bote.fornecedor.nome,transacao_itens.produto.nome,(sum)transacao_itens.valor_total,tipo',
        group: 'bote.nome,bote.fornecedor.nome,transacao_itens.produto.nome,tipo',
        status: 0,
        createdAt: ">" + d1.toISOString() + ",<" + d2.toISOString(),
        order: 'bote_nome,ASC'
    })

    if (resTransicao.data.error || !resTransicao.data.data || !Array.isArray(resTransicao.data.data)) return alert('error 001 /boatEntryComparation')

    let prd = resTransicao.data.data.map((each: any) => { return { tipo: each.tipo, produto: each.produto_nome } })
    let prd0 = prd.filter(each => !each.tipo)
    let prd1 = prd.filter(each => each.tipo)
    prd = [...prd0, { produto: "Total", tipo: false }, ...prd1, { produto: "Total Geral", tipo: false }]
    let products = prd.reduce((acum, next) => {
        if (!acum.includes(next.produto) && next.produto)
            return acum + ',' + next.produto
        return acum
    }, '').split(",").slice(1)

    let dataTrasacao = resTransicao.data.data.reduce((acum, next: any) => {
        let mo = { ...acum }
        let boatKey = getSigles(next.fornecedor_nome) + ' - ' + next.bote_nome
        if (!mo[boatKey]) {
            mo[boatKey] = {}
            products.forEach((each) => mo[boatKey][each] = 0)
        }
        if (products.includes(next.produto_nome))
            mo[boatKey][next.produto_nome] = next.tipo ? -next.transacao_itens_valor_total ?? 0 : next.transacao_itens_valor_total

        if (!mo[boatKey]['Total'])
            mo[boatKey]['Total'] = 0
        mo[boatKey]['Total'] += next.tipo == false ? next.transacao_itens_valor_total : 0

        if (!mo[boatKey]['Total Geral'])
            mo[boatKey]['Total Geral'] = 0
        mo[boatKey]['Total Geral'] += next.tipo == false ? next.transacao_itens_valor_total : -next.transacao_itens_valor_total
        return mo
    }, {} as any)

    const table: string[][] = Object.entries(dataTrasacao).map((each: any) => [each[0], ...Object.values(each[1])])

    const today = new Date()

    let lastBoundingBox = writeHeader(pdf, today.toLocaleDateString().slice(0, 5), d1, d2)

    pdf.setFontSize(10)

    let tableDispositionOfStyle = ['bold']
    tableDispositionOfStyle[table[0].length - 1] = 'bold'
    tableDispositionOfStyle[products.length - 3] = 'bold'

    writeTable(pdf, table, lastBoundingBox.x, lastBoundingBox.y2 + 7, ["Bote", ...getSigles(products)], [2], tableDispositionOfStyle)

    openPDF(pdf)
}

function getSigles(str: string | string[]) {
    if (Array.isArray(str))
        return str.map(each => {
            const sp = each.split(" ")
            if (sp[1]) return sp[0][0] + ". " + sp[1]
            return each
        })

    const sp = str.split(" ")
    if (sp[1]) return sp[0][0] + ". " + sp[1]
    return str

}