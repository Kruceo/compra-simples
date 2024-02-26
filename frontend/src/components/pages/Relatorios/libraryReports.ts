import jsPDF from "jspdf"
import backend, { BackendTableComp } from "../../../constants/backend"
import beautyNumber from "../../../constants/numberUtils"

interface PdfItemBoundings {
    x: number,
    y: number,
    w: number,
    h: number,
    x2: number,
    y2: number,
    centerX: number
}

export async function getPriceGroupedEntryTotalValues(where: any) {
    const response = await backend.get('transacao', { status: 0, include: "transacao_item{produto}", ...where })
    if ((response.data.error || !response.data.data)) return;
    if (!Array.isArray(response.data.data)) return;

    const fdata = response.data.data

    const itens = fdata.reduce((acum, next) => {
        return [...acum, ...(next.transacao_itens ?? [])]
    }, [] as BackendTableComp[])

    const obj: any = {}

    itens.forEach(each => {
        const productName = (each.produto?.nome) ?? "Undefined"
        const productPrice = (each.preco ?? -1)
        if (!obj[productName])
            obj[productName] = {

            }
        if (obj[productName]) {
            if (!obj[productName][productPrice]) {
                obj[productName][productPrice] = { value: each.valor_total, weight: each.peso }
            }
            else {
                obj[productName][productPrice].value += each.valor_total
                obj[productName][productPrice].weight += each.peso
            }
        }

    })
    console.log(obj)
    return obj
}

export function groupedEntry2Table(obj: any) {
    const tables: string[][][] = []

    Object.entries(obj).forEach(([especie, especieData]: [string, any]) => {
        let totalProductWeight = 0
        let totalProductValue = 0
        const table: string[][] = []
        Object.entries(especieData).forEach(([price, priceData]: [string, any]) => {
            const tableRow = []
            tableRow.push(especie, beautyNumber(parseFloat(price)), beautyNumber(priceData.weight), beautyNumber(priceData.value))
            table.push(tableRow)
            totalProductValue += priceData.value
            totalProductWeight += priceData.weight
        })
        table.push(["-", "TOTAL", beautyNumber(totalProductWeight), beautyNumber(totalProductValue)])
        tables.push(table)
    })
    console.log(tables[0])
    return tables
}

export async function getGroupedValueTotalsByType(type: number, where: any) {
    const response = await backend.get('entrada', { status: 0, tipo: type, include: "transacao_item{produto}", ...where })
    if ((!response.data || response.data.error || !response.data.data)) return null

    if (!Array.isArray(response.data.data)) return;

    let values: any = {}

    response.data.data.forEach(entrada => {
        entrada.transacao_itens?.forEach(transacao_item => {
            const produto = transacao_item.produto

            if (produto && produto.nome) {
                console.log(transacao_item.id, transacao_item.produto_id)
                if (!values[produto.nome])
                    values[produto.nome] = transacao_item.valor_total ?? 0
                else values[produto.nome] += transacao_item.valor_total ?? 0
            }
        })
    })

    return values
}

export async function getSumOf(attrToSum: "peso" | "valor_total", where: any) {
    const response = await backend.get('transacao', { status: 0, include: "transacao_item{produto}", ...where })
    if ((response.data.error || !response.data.data)) return null

    if (!Array.isArray(response.data.data)) return;
    let sum = 0
    response.data.data.forEach(entrada => {
        if (!entrada.transacao_itens) return;
        entrada.transacao_itens.forEach(entrada_item => {
            if (entrada_item[attrToSum])
                sum += entrada_item[attrToSum] ?? 0
            else alert("Ocorreu um erro na geração do relatório.")
        }
        )
    })
    return sum
}

export function writeTable(pdf: jsPDF, data: (string | number)[][], startX: number, startY: number, header: string[], dispositionOfData?: number[]): PdfItemBoundings {

    let sX = startX
    let sY = startY

    const disposition = dispositionOfData ?? data[0].map(() => 1)
    const dispositionSum = disposition.reduce((acum, next) => acum + next, 0)

    const fullW = pdf.internal.pageSize.width
    const fullH = pdf.internal.pageSize.height
    const rowH = 7
    const cellFraction = (fullW - startX * 2) / dispositionSum

    const dataWithHeader = [[...header], ...data]
    const sumH = dataWithHeader.length * rowH

    if (startY + sumH + 7 > fullH - 5) {
        pdf.addPage()
        pdf.setPage(pdf.internal.pages.length)
        sY = 5
    }

    dataWithHeader.forEach((row, rowIndex) => {
        const y = sY + (rowIndex * rowH)

        pdf.setFontSize(12)
        let colXSum = 0
        row.forEach((column, columnIndex) => {
            const cellW = cellFraction * disposition[columnIndex]
            if (typeof (column) == 'number') column = beautyNumber(column)
            if (column == "-") { colXSum += cellW; return; }


            //Case is first index
            if (rowIndex == 0) {
                pdf.setFont(pdf.getFont().fontName, "bold")
                pdf.setLineWidth(0.75)
            }
            else {
                pdf.setFont(pdf.getFont().fontName, "normal")
                pdf.setLineWidth(0.25)
            }

            const x = sX + colXSum
            const box = writeBox(pdf, x, y, cellW, rowH)

            let align: "left" | "right" | "center" = 'left'
            let textX = box.x + 1

            //Case is number
            if (/^(\d|,|\.)+$/.test(column)) {
                align = "right"
                textX = box.x2 - 1
            }
            else {
                align = "center"
                textX = box.centerX
            }

            colXSum += cellW
            pdf.text(column, textX, box.y2 - box.h / 4, { align: align })
        })

    })
    return { x: sX, y: sY, w: fullW, h: sumH, x2: sX + fullW, y2: sY + sumH, centerX: fullW / 2 }
}

export function writeBox(pdf: jsPDF, x: number, y: number, w: number, h: number): PdfItemBoundings {
    pdf.rect(x, y, w, h)
    return { x, y, w, h, x2: w + x, y2: h + y, centerX: x + w / 2 }
}

export function writeHeader(pdf: jsPDF, identification: string, date1: Date, date2: Date): PdfItemBoundings {
    const startY = 5
    const startX = 5
    const height = 15
    const pageW = pdf.internal.pageSize.width
    const pageH = pdf.internal.pageSize.height

    pdf.setLineWidth(0.75);
    const headerBox = writeBox(pdf, startX, startY, pageW - 45, height)
    const dateBox = writeBox(pdf, headerBox.x2, headerBox.y, 35, headerBox.h)

    pdf.setFontSize(16)
    pdf.setFont(pdf.getFont().fontName, "", "bold")
    pdf.text("CONTROLE DE ENTRADA DE CAMARÃO/ARTESANAL", headerBox.centerX, 12, { align: 'center' })

    pdf.setFont(pdf.getFont().fontName, "", "normal")
    pdf.setFontSize(12)
    pdf.text(`SEMANA DE ${date1.toLocaleDateString()} À ${date2.toLocaleDateString()}`, headerBox.centerX, 18, { align: "center" })

    pdf.setFont(pdf.getFont().fontName, "", "bold")
    pdf.setFontSize(20)
    pdf.text(`${identification}`, dateBox.centerX, 15, { align: "center" })

    const totalW = headerBox.w + dateBox.w

    return { x: startX, y: startY, h: height, w: totalW, x2: startX + totalW, y2: startY + height, centerX: startX + totalW / 2 }
}

export function openPDF(pdf: jsPDF) {
    const dadosDoPDF = pdf.output('dataurlstring');

    // Cria uma nova janela ou guia do navegador e abre o PDF
    const novaJanela = window.open();
    if (novaJanela)
        novaJanela.document.write('<iframe width="100%" height="100%" src="' + dadosDoPDF + '"></iframe>');
}