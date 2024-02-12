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

export async function productEntryPriceComparation(date1: Date, date2: Date) {
    const pdf = new jsPDF()

    const headerBox = writeHeader(pdf,
        (new Date()).toLocaleDateString().slice(0, 5),
        date1, date2
    )

    const d1 = date1
    const d2 = date2
    
    const where = {
        createdAt: `>${d1.toISOString()},<${d2.toISOString()}`
    }

    const groupedTotalValues = await getGroupedEntryTotalValues(where)
    if (!groupedTotalValues || !groupedTotalValues.tables)
        return console.error("productEntryPriceComparation error");

    let lastTableBounding = headerBox

    //Gerar todas as tabelas usando o local Y da ultima tabela 
    groupedTotalValues.tables.forEach(table => {
        const tableResult = table.pop()
        //escreve a tabela
        lastTableBounding = writeTable(pdf, table, 5, lastTableBounding.y2 + 7, ["ESPÉCIE", "PREÇO", "PESO (KG)", "VALOR"], [4, 2, 2, 2])
        //escreve a parte de baixo com o total de peso e valor
        lastTableBounding = writeTable(pdf, [], 5, lastTableBounding.y2, tableResult ?? [], [4, 2, 2, 2])
    })

    lastTableBounding = writeTable(pdf, [], 5, lastTableBounding.y2 + 7, ["-", "SUBTOTAL", beautyNumber(groupedTotalValues.sumPeso), beautyNumber(groupedTotalValues.sumValor)], [4, 2, 2, 2])

    //Pega os valores da parte de descontos, geralmente gelo e sufito 
    const type1Values = await getGroupedTotalsByType(1, where)
    lastTableBounding.y2 += 7
    Object.entries(type1Values).forEach((each: [string, any]) => {
        lastTableBounding = writeTable(pdf, [], 5, lastTableBounding.y2, ["-", "-", each[0], beautyNumber(each[1])], [4, 2, 2, 2])
    })

    //Gera o ultimo 
    //soma das Compras
    const entradaType0Sum = await getSumOfType(0, "valor_total", where)
    //Soma das vendas
    const entradaType1Sum = await getSumOfType(1, "valor_total", where)

    if (entradaType0Sum && entradaType1Sum) {
        const total = entradaType0Sum - entradaType1Sum
        writeTable(pdf, [], 5, lastTableBounding.y2 + 7, ["-", "-", "TOTAL GERAL", beautyNumber(total)], [4, 2, 2, 2])
    }

    const dadosDoPDF = pdf.output('dataurlstring');

    // Cria uma nova janela ou guia do navegador e abre o PDF
    const novaJanela = window.open();
    if (novaJanela)
        novaJanela.document.write('<iframe width="100%" height="100%" src="' + dadosDoPDF + '"></iframe>');

}

async function getGroupedEntryTotalValues(where: any) {
    const response = await backend.get('entrada', { status: 0, include: "entrada_item{produto}", ...where })
    if ((response.data.error || !response.data.data)) return;

    if (!Array.isArray(response.data.data)) return alert(2);
    let compraEntradaItens: BackendTableComp[] = []
    response.data.data.forEach(each => compraEntradaItens.push(...each.entrada_itens ?? []))
    //FILTRA PELO TIPO, APENAS ITENS DO TIPO COMPRA
    compraEntradaItens = compraEntradaItens.filter(each => !each.tipo)

    const values: any = {}
    let sumValor = 0
    let sumPeso = 0
    compraEntradaItens.forEach(each => {
        if (!each.produto || !each.produto.nome) return;

        if (!values[each.produto.nome]) {
            values[each.produto.nome] = {}
        }
        if (!values[each.produto.nome]["" + each.preco]) {
            values[each.produto.nome]["" + each.preco] = {
                valor: each.valor_total,
                peso: each.peso
            }
        }
        else {
            values[each.produto.nome]["" + each.preco].peso += each.peso
            values[each.produto.nome]["" + each.preco].valor += each.valor_total
        }
    })
    const tables: string[][][] = []
    Object.entries(values).forEach((produtoData: [string, any]) => {
        let sumProdutoValor = 0
        let sumProdutoPeso = 0
        const table = []
        Object.entries(produtoData[1])
            .sort((a: [string, any], b: [string, any]) => parseFloat(a[0]) - parseFloat(b[0]))
            .forEach((valueData: [string, any]) => {
                const row: string[] = [produtoData[0]]
                row.push(beautyNumber(parseFloat(valueData[0])))
                row.push(valueData[1].peso.toLocaleString())
                row.push(beautyNumber(valueData[1].valor))
                table.push(row)
                sumProdutoValor += valueData[1].valor
                sumProdutoPeso += valueData[1].peso
            })
        sumValor += sumProdutoValor
        sumPeso += sumProdutoPeso
        table.push(["-", "TOTAL", sumProdutoPeso.toLocaleString(), beautyNumber(sumProdutoValor)])
        tables.push(table)
    })

    return { tables, sumPeso, sumValor }
}

async function getGroupedTotalsByType(type: number, where: any) {
    const response = await backend.get('entrada', { status: 0, include: "entrada_item{produto}", ...where })
    if ((!response.data || response.data.error || !response.data.data)) return null

    if (!Array.isArray(response.data.data)) return;

    let values: any = {}

    response.data.data.forEach(entrada => {
        entrada.entrada_itens?.forEach(entrada_item => {
            const produto = entrada_item.produto

            if (entrada_item.tipo == type && produto && produto.nome) {
                console.log(entrada_item.id, entrada_item.produto_id)
                if (!values[produto.nome])
                    values[produto.nome] = entrada_item.valor_total ?? 0
                else values[produto.nome] += entrada_item.valor_total ?? 0
            }
        })
    })

    return values
}

export async function getSumOfType(type: number, attrToSum: "peso" | "valor_total", where: any) {
    const response = await backend.get('entrada', { status: 0, include: "entrada_item{produto}", ...where })
    if ((response.data.error || !response.data.data)) return null

    if (!Array.isArray(response.data.data)) return;
    let sum = 0
    response.data.data.forEach(entrada => {
        if (!entrada.entrada_itens) return;
        entrada.entrada_itens.forEach(entrada_item => {
            if (entrada_item.tipo == type) {
                if (entrada_item[attrToSum])
                    sum += entrada_item[attrToSum] ?? 0
                else alert("Ocorreu um erro na geração do relatório.")
            }
        })
    })
    return sum
}

export function writeTable(pdf: jsPDF, data: string[][], startX: number, startY: number, header: string[], dispositionOfData?: number[]): PdfItemBoundings {

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
    pdf.text(`N ${identification}`, dateBox.centerX, 15, { align: "center" })

    const totalW = headerBox.w + dateBox.w

    return { x: startX, y: startY, h: height, w: totalW, x2: startX + totalW, y2: startY + height, centerX: startX + totalW / 2 }
}