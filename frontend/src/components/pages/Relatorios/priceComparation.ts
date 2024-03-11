import jsPDF from "jspdf";
import backend, { BackendTableComp } from "../../../constants/backend";
import { openPDF, writeHeader, writeTable } from "./libraryReports";
import beautyNumber from "../../../constants/numberUtils";

export async function priceComparation(d1: Date, d2: Date,status:number) {
    const resEntry = await backend.get("transacao", {
        include: "transacao_item[]{produto[]}",
        attributes: "transacao_itens.produto.nome,transacao_itens.preco,(sum)transacao_itens.peso,(sum)transacao_itens.valor_total",
        group: "transacao_itens.produto.nome,transacao_itens.preco",
        tipo: 0,
        status: status,
        createdAt:">"+d1.toISOString() +',<' + d2.toISOString()
    })
    console.log(resEntry)
    const resExit = await backend.get("transacao", {
        include: "transacao_item[]{produto[]}",
        attributes: "transacao_itens.produto.nome,(sum)transacao_itens.valor_total",
        group: "transacao_itens.produto.nome",
        tipo: 1, // exit,
        status: status,
        createdAt:">"+d1.toISOString() +',<' + d2.toISOString()
    })

    if (resEntry.data.error || resEntry.data.error || !Array.isArray(resEntry.data.data)) return;
    if (resExit.data.error || resExit.data.error || !Array.isArray(resExit.data.data)) return;

    let entryData = resEntry.data.data
    let exitData = resExit.data.data

    entryData = entryData.filter(each => !Object.values(each).includes(null))
    exitData = exitData.filter(each => !Object.values(each).includes(null))

    const entryTables = processInfo(entryData)
    const exitTables = exitData.map(each => ['-', '-', ...Object.values(each)])

    const pdf = new jsPDF()

    const today = new Date()
    
    let lastBoundingBox = writeHeader(pdf, today.toLocaleDateString().slice(0,5), d1, d2)
    
    pdf.setFontSize(12)

    const disposition = [2, 1, 1, 1]
    entryTables.tables.forEach(each => {
        const totals = each[0]
        lastBoundingBox = writeTable(pdf, each.slice(1), 5, lastBoundingBox.y2 + 8, ["ESPÉCIE", "PREÇO", "PESO", "VALOR"], disposition)
        lastBoundingBox = writeTable(pdf, [], 5, lastBoundingBox.y2, totals, disposition)
    })

    lastBoundingBox = writeTable(pdf, [], 5, lastBoundingBox.y2 + 8, ["-", "SUBTOTAL", beautyNumber(entryTables.totalWeight), beautyNumber(entryTables.totalValue)], disposition)

    lastBoundingBox = writeTable(pdf, exitTables, 5, lastBoundingBox.y2, [], disposition)

    const mainTotal = entryTables.totalValue - exitTables.reduce((acum, next) => acum + next[3], 0)
    
    lastBoundingBox = writeTable(pdf, [], 5, lastBoundingBox.y2 + 8, ["-","-","TOTAL GERAL",beautyNumber(mainTotal)], disposition)

    openPDF(pdf)
}


function processInfo(data: BackendTableComp[]) {
    let table = data.map(each => Object.values(each))

    let totalWeight = 0
    let totalValue = 0

    const tables: any = {}
    table.forEach(each => {
        if (!tables[each[0]]) tables[each[0]] = [["-", "TOTAL", 0, 0]]
        tables[each[0]].push(each)
        const [, , w, v] = each
        tables[each[0]][0][2] += w
        tables[each[0]][0][3] += v
        totalValue += v
        totalWeight += w
    })

    const parsedTables: string[][][] = Object.values(tables)
    return {
        totalValue, totalWeight,
        tables: parsedTables
    }
}