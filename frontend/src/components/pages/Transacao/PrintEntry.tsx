import { useEffect } from "react";
import backend from "../../../constants/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import thermalPrinter from "../../../constants/thermalPrinter";
import Button from "../../Layout/Button";

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
                <Button onClick={()=>printSingleEntry(id)}><i>&#xe954;</i> Imprimir Cupom </Button>
            </div>
        </Content>
    </>
}



export async function printSingleEntry(id:number|string) {

    if (localStorage.getItem("printerSessionLocker")) return
    localStorage.setItem("printerSessionLocker", "true")
    const width: number = (await thermalPrinter.getWidth()).data.width

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

    queries.push(['println', `${"Produto".padEnd(width / 4 * 2, ' ')} ${"Peso".padEnd(width / 4, ' ')} ${"Total"}`])
    queries.push(['println', '-'.repeat(width)])


    console.log(d.data.data)
    item.transacao_itens?.forEach(each => {
        const { produto, peso, valor_total } = each

        queries.push([
            'println',
            `${produto?.nome?.toString().padEnd(width / 4 * 2, ' ')} ${peso?.toString().padEnd(width / 4, ' ')} ${valor_total?.toString()}`
        ])
    })
    queries.push(['println', '-'.repeat(width)])
    queries.push(['println', `Peso: ${item.peso}`.padEnd(width / 4 * 2 + 1, ' ') + 'Valor: ' + item.valor])


    queries.push(['cut'])
    // setQ(queries)
    console.log(queries)
    thermalPrinter.print(queries)
    localStorage.removeItem("printerSessionLocker")

}
