import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import Table from "../../table/Table";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import { BackendTableComp } from "../../../constants/backend";
import { bDate } from "../../../constants/dateUtils";
import { TRANSACTION_CLOSED, TRANSACTION_OPEN } from "../../../constants/codes";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import beautyNumber from "../../../constants/numberUtils";
import { changeEntryStatus } from "./internal";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import thermalPrinter from "../../../constants/thermalPrinter";

export default function CloseEntry() {
    const { defaultDataGet } = useContext(TableEngineContext)
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const [where,] = useState<any>({ include: "bote{fornecedor},usuario", status: TRANSACTION_OPEN, order: "updatedAt,DESC" })
    const [selected, setSelected] = useState<number[]>([])
    const [update, setUpdate] = useState(true)
    const [data, setData] = useState<BackendTableComp[]>([])

    const table_to_manage = "transacao"
    useEffect(() => {
        defaultDataGet(table_to_manage, where, setData)
    }, [where, update])

    const submitCloseHandler = () => {
        simpleSpawnInfo("Tem certeza que deseja continuar?", async () => {
            for (const item_id of selected) {
                await changeEntryStatus(item_id, TRANSACTION_CLOSED)
            }
            setTimeout(() => {
                setSelected([])
                setUpdate(!update)
            }, 250);

            const chunkSize = (await (await thermalPrinter.getWidth()).data.width) / 3

            let printerQuery = [
                ["center", ""],
                ["println", "Fechamento " + bDate((new Date()).toISOString())],
                ["left", ""],

                ["println", "-".repeat(chunkSize * 3)],
                ["println", ""], ["println", ""],
                ["println", "Data".padEnd(chunkSize * 1) + "Trans ID".padEnd(chunkSize * 1) + "Valor"],
                ["println", "-".repeat(chunkSize * 3)],
            ]

            let totalValue = 0
            data.forEach(each => {
                if (!each.id || !each.valor || !selected.includes(each.id)) return;

                totalValue += each.tipo ? -each.valor : each.valor
                printerQuery.push(["println",
                    bDate(each.createdAt).padEnd(chunkSize, ' ')
                    + each.id?.toString().padStart(chunkSize * 0.5, ' ')
                    + beautyNumber(each.tipo ? -each.valor : each.valor).padStart(chunkSize * 1.5, ' ')
                ])
            })
            printerQuery.push(["println", "-".repeat(chunkSize * 3)])
            printerQuery.push(["println", ""])
            printerQuery.push(["println", "Valor Total:" + beautyNumber(totalValue).padStart(3 * chunkSize - 12, ' ')])

            printerQuery.push(["cut"])
            await thermalPrinter.print(printerQuery)

        }, () => null)
    }

    return <>
        <Bar />
        <SideBar />

        <Content>
            <SubTopBar>
                <ToolBarButton onClick={() => {
                    if (selected.length > 0) setSelected([])
                    else setSelected(data.map(each => each.id ?? -1))
                }}><i>&#xe997;</i> Selecionar Todos</ToolBarButton>

                <ToolBarButton enabled={selected.length > 0} onClick={submitCloseHandler}>
                    <i>&#xe95e;</i> Concluir Fechamento</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    data={data}
                    disposition={[0.2, 1, 1, 1, 1, 1, 0.2]}
                    tableHeader={["ID", 'Fornecedor', 'Bote', 'Peso', 'Valor', "Data de Criação", "T"]}
                    tableItemHandler={(item) => [
                        item.id,
                        item.bote?.fornecedor?.nome,
                        item.bote?.nome,

                        <div className="text-right">{beautyNumber(item.peso ?? -1)}</div>,
                        <div className="text-right">{beautyNumber(item.valor ?? -1)}</div>,
                        bDate(item.createdAt),
                        <div className="text-right">{item.tipo ? <i title="Saída" className="text-red-600">&#xea3f;</i> : <i title="Entrada" className="text-green-600">&#xea3b;</i>}</div>
                    ]}
                    enableContextMenu={false}
                    selected={selected}
                    selectedSetter={setSelected}
                ></Table>
            </div>
        </Content>
    </>
}