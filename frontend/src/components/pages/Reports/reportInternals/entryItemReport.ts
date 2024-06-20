import jsPDF from "jspdf";
import backend from "../../../../constants/backend/backend";
import { openPDF, writeHeader, writeTable } from "./libraryReports";

export default async function entryItemReport(d1: Date, d2: Date, status: number, produtoId?: string | number) {

    const response = await backend.get("transacao_item", {
        "transacao.status": status,
        "transacao.tipo": 0,
        "transacao.createdAt": ">" + d1.toISOString() + ',<' + d2.toISOString(),
        produto_id: produtoId,
        include: "transacao[]{bote[]{fornecedor[]}},produto[]",
        attributes: "transacao.bote.fornecedor.nome,transacao.bote.nome,produto.nome,transacao_item.peso,transacao_item.preco,valor_total"
    })

    const data = response.data.data
    if (response.data.error || !data) return console.error(response.data.message)

    const table = data.map(each => Object.values(each))

    const pdf = new jsPDF()

    let lastBox = writeHeader(pdf, '', d1, d2)

    pdf.setFontSize(10)
    lastBox = writeTable(pdf, table, lastBox.x, lastBox.y2 + 7, ["Fornecedor", "Bote", "Produto", "Peso", "Preço", "Total"], [2, 2, 2, 1, 1, 1])

    openPDF(pdf)

}