import jsPDF from "jspdf"
import backend from "../../../../constants/backend/backend"
import { writeHeader, writeTable, openPDF } from "./libraryReports"

export default async function totalsByVendors(d1: Date, d2: Date, status: number) {

    const res = await backend.get("transacao", {
        include: "bote[]{fornecedor[]}",
        attributes: "bote.fornecedor.nome,(sum)valor",
        group: "bote.fornecedor.nome",
        tipo: 0,
        status:status
    })

    if (res.data.error || !res.data.data) return console.error(res.data.message)

    const data = res.data.data

    const table = data.map(each => {
        return Object.values(each)
    })
    const pdf = new jsPDF()
    let lastBox = writeHeader(pdf, '', d1, d2)
    pdf.setFontSize(10)
    writeTable(pdf, table, lastBox.x, lastBox.y2 + 6, ["Fornecedor", "Valor"])

    openPDF(pdf)
}