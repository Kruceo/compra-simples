import jsPDF from "jspdf";
import beautyNumber from "../../../constants/numberUtils";
import extenso from "extenso";
import { writeBox } from "../Relatorios/reportInternals/libraryReports";
import { extenseDate } from "../../../constants/dateUtils";

export function WriteReceipt2PDF(pdf: jsPDF, y: number, value: number, receiverName: string, date: Date, referenceText?: string, n?: number) {
    function extensor(b: number) {
        const num = beautyNumber(b)
        const options: any = { mode: 'currency', currency: { type: 'BRL' }, number: { decimal: 'formal' } }
        return extenso(num, options)
    }
    const startFontSize = pdf.getFontSize()

    const outerBox = writeBox(pdf, 5, y, pdf.internal.pageSize.width - 10, 80)

    const valueBox = writeBox(pdf, outerBox.x2 - 50, outerBox.y + 5, 50, 7)

    pdf.text("R$", valueBox.x - 10, valueBox.y2 - 1.5)

    pdf.text(beautyNumber(value), valueBox.x + 1, valueBox.y2 - 1.5)

    const nBox = writeBox(pdf, outerBox.x + 45, valueBox.y, 25, 7)
    pdf.text("RECIBO N° ", outerBox.x + 5, valueBox.y2 - 1.5)
    pdf.text(n ? n.toString() : "", nBox.centerX, nBox.y2 - 1.5, { align: "center" })

    pdf.setFontSize(10)
    pdf.text("Recebemos " + extensor(value), outerBox.x + 5, outerBox.y + 20)

    const line1Box = writeBox(pdf, outerBox.x, outerBox.y + 35, outerBox.w, 5)
    const line2Box = writeBox(pdf, outerBox.x, line1Box.y2, outerBox.w, 5)

    const lines = []
    const defaultLineY = line1Box.y - 1
    if (referenceText) {
        const text = "Referente a: " + referenceText
        for (let i = 0; i < 3; i++) {
            lines.push(text.slice(i * 90, (i + 1) * 90));
        }

        lines.forEach((each, index) => {
            pdf.text(each, outerBox.x + 5, defaultLineY + (index * 5))
        })
    }

    pdf.text("E por ser verdade, firmamos o presente recibo.", outerBox.x + 5, line2Box.y2 + 5)
    pdf.text("Balneário Piçarras, " + extenseDate(date), outerBox.x + 88, line2Box.y2 + 10)

    const assinatureLine = writeBox(pdf, outerBox.x + 88, outerBox.y2 - 10, 75, 0)
    pdf.text(receiverName, assinatureLine.centerX, outerBox.y2 - 5, { align: "center" })

    pdf.setFontSize(startFontSize)

    return outerBox
}