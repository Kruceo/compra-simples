import jsPDF from "jspdf"
import backend from "../../../../constants/backend/backend"
import { writeHeader, writeTable, openPDF } from "./libraryReports"

export default async function totalsByVendors(d1: Date, d2: Date, status: number) {

    //compras 
    const res0 = await backend.get("transacao", {
        include: "bote[]{fornecedor[]}",
        attributes: "bote.fornecedor.nome,(sum)valor,(sum)peso,tipo",
        group: "bote.fornecedor.nome,tipo",
        status: status,
        order: "tipo,DESC",
        createdAt:">"+d1.toISOString()+",<"+d2.toISOString()
    })

    if (res0.data.error || !res0.data.data) return console.error(res0.data.message)

    const data0 = res0.data.data as unknown as { tipo: boolean, fornecedor_nome: string,peso:number, valor: number }[]

    const reduced = data0.reduce((acum, next) => {
        if (!acum[next.fornecedor_nome]) acum[next.fornecedor_nome] = { weight:0,value: 0, desconts: 0, total: 0 }
        if (next.tipo) {
            //tipo 1 
            acum[next.fornecedor_nome]["desconts"] += next.valor
        }
        else {
            //tipo 0 
            acum[next.fornecedor_nome]["value"] += next.valor
            acum[next.fornecedor_nome]["weight"] += next.peso

        }
        acum[next.fornecedor_nome]["total"] = acum[next.fornecedor_nome]["value"] - acum[next.fornecedor_nome]["desconts"]

        return acum
    }, {} as any)

    console.log(reduced)

    const table = Object.entries(reduced).map((each) => {
        const e = each as [string, { value: number,weight:number, desconts: number, total: number }]
        return [e[0], ...Object.values(e[1])]
    })
    console.log("#####", table)

    const pdf = new jsPDF()
    const lastBox = writeHeader(pdf, '', d1, d2)
    pdf.setFontSize(10)
    writeTable(pdf, table, lastBox.x, lastBox.y2 + 6, ["Fornecedor", "Peso","Valor","Descontos","Total"],[2])

    openPDF(pdf)
}