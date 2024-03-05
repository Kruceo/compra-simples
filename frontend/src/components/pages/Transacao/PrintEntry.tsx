import { useEffect } from "react";
import backend from "../../../constants/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import thermalPrinter from "../../../constants/thermalPrinter";
import Button from "../../Layout/Button";
import beautyNumber from "../../../constants/numberUtils";
import { getSigles } from "../../../constants/stringUtils";

export default function PrintEntry() {
    const url = new URL(window.location.href)
    const id = url.search.replace("?", "").split('=')[1]

    if (!id) return "Essa página funciona com a referência de um ID. (?id=10)"
    localStorage.removeItem('printerSessionLocker')
    useEffect(() => {

        printSingleEntry(id)
    }, [])

    return <>
        <Bar />
        <SideBar />
        <Content>
            <div className="p-4">
                <h2 className="my-4">Impressão de transação</h2>
                <Button onClick={() => printSingleEntry(id)}><i>&#xe954;</i> Imprimir Cupom </Button>
            </div>
        </Content>
    </>
}



export async function printSingleEntry(id: number | string) {

    if (localStorage.getItem("printerSessionLocker")) return
    localStorage.setItem("printerSessionLocker", "true")
    const width: number = (await thermalPrinter.getWidth()).data.width
    const chunkSize = width/3
    let d = await backend.get('transacao', { include: "bote{fornecedor},transacao_item{produto[nome]}", id })
    if (d.data.error || !d.data.data || !Array.isArray(d.data.data)) return console.error(d.data.message);

    let queries: string[][] = []
    const item = d.data.data[0]
    queries.push(['center'])
    queries.push(['println', `Transacao ${item.id}`])
    queries.push(['left'])
    queries.push(['println', '-'.repeat(width)])

    queries.push(['println', `Tipo: ${!item.tipo ? "Entrada" : "Saída"}`])
    queries.push(['println', `Bote: ${item.bote?.nome}`])
    queries.push(['println', `Fornecedor: ${item.bote?.fornecedor?.nome}`])
    queries.push(['println', ""])
    queries.push(['println', ""])

    queries.push(['println', `${"Produto".padEnd(chunkSize, ' ')} ${"Peso".padEnd(chunkSize-1, ' ')} ${"Total"}`])
    queries.push(['println', '-'.repeat(width)])

    
    console.log(d.data.data)
    item.transacao_itens?.forEach(each => {
        const { produto, peso, valor_total } = each
        
        queries.push([
            'println',
            `\
${getSigles(produto?.nome?.toString()??"Não Definido").toString().padEnd(chunkSize, ' ')} \
${beautyNumber(peso       ??-1) .toString().padStart(chunkSize-1, ' ')} \
${beautyNumber(valor_total??-1) .toString().padStart(chunkSize-1, ' ')}`
        ])
    })
    queries.push(['println', '-'.repeat(width)])
    queries.push(['println', ''])
    queries.push(['println', `${" ".repeat(chunkSize * 1.5)}Peso: ` + (beautyNumber( item.peso??-1).padStart(chunkSize*1.5 -6, ' '))])
    queries.push(['println', `${" ".repeat(chunkSize * 1.5)}Valor: ` + (beautyNumber( item.valor??-1).padStart(chunkSize*1.5 -7, ' '))])


    queries.push(['cut'])
    // setQ(queries)
    console.log(queries)
    thermalPrinter.print(queries)
    localStorage.removeItem("printerSessionLocker")

}
