import { useContext, useEffect, useState } from "react";

import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import Table from "../../table/Table";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { WriteReceipt2PDF } from "./libReceipt";
import jsPDF from "jspdf";
import { openPDF, writeBox } from "../Reports/reportInternals/libraryReports";
import { getNextSaturday } from "../../../constants/dateUtils";
import { TRANSACTION_OPEN } from "../../../constants/codes";
import beautyNumber from "../../../constants/numberUtils";

interface PerVendorResponse {
    fornecedor_nome: string, valor: number, tipo: boolean, id: number, bote_fornecedor_id: number
}

interface ParsedVendorResponse {
    value: number, id: number, desconts: number, total: number, nome: string
}

export default function ViewPerVendorReceipt() {
    const { defaultDataGet } = useContext(TableEngineContext)
    const [data, setData] = useState<ParsedVendorResponse[]>([])
    const [selected, setSelected] = useState<number[]>([])
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        setLoadingData(true)
        defaultDataGet("transacao", {
            include: "bote[]{fornecedor[]}",
            attributes: "bote.fornecedor_id,bote.fornecedor.nome,(sum)valor,tipo",
            group: "bote.fornecedor_id,bote.fornecedor.nome,tipo",
            status: TRANSACTION_OPEN
        }, (d: PerVendorResponse[]) => {

            let p: ParsedVendorResponse[] = d.reduce((acum, next) => {
                if (!acum[next.bote_fornecedor_id]) acum[next.bote_fornecedor_id] = { nome: next.fornecedor_nome, desconts: 0, value: 0, total: 0, id: -1 }
                if (next.tipo) {
                    acum[next.bote_fornecedor_id].desconts += next.valor
                } else acum[next.bote_fornecedor_id].value += next.valor

                acum[next.bote_fornecedor_id].total = acum[next.bote_fornecedor_id].value - acum[next.bote_fornecedor_id].desconts
                return acum
            }, [] as ParsedVendorResponse[])

            p = p.filter(each => each != null).map((each, index) => { return { ...each, id: parseInt(`${index}`) } })
            setData(p)
            setLoadingData(false)
        })

    }, [])
    function generateReceipts() {
        const pdf = new jsPDF()
        const selectedItems = data.filter(each => selected.includes(each.id ?? -1))
        const saturdayDate = getNextSaturday()
        let lastBox = writeBox(pdf, 0, -5, 0, 0)
        selectedItems.forEach(each => {
            const { total, nome } = each
            if (lastBox.y2 + 85 > pdf.internal.pageSize.height) {
                pdf.addPage()
                lastBox = WriteReceipt2PDF(pdf, 5, total, nome, saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")
                return;
            }
            lastBox = WriteReceipt2PDF(pdf, lastBox.y2 + 10, total, nome, saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")

        })
        openPDF(pdf)
    }

    return <>
        <Bar></Bar>
        <SideBar></SideBar>
        <Content>
            <SubTopBar>
                <ToolBarButton onClick={() => {
                    if (selected.length > 0) setSelected([])
                    else setSelected(data.map(each => each.id ?? -1))
                }}><i>&#xe997;</i> Selecionar Todos</ToolBarButton>
                <ToolBarButton enabled={selected.length > 0} onClick={generateReceipts}><i>&#xe93b;</i> Gerar Recibos</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    loading={loadingData}
                    data={data as any}
                    tableItemHandler={(item: ParsedVendorResponse) => {
                        return [
                            item.nome,
                            <div className="text-right">{beautyNumber(item.value)}</div>,
                            <div className="text-right">{beautyNumber(item.desconts)}</div>,
                            <div className="text-right">{beautyNumber(item.total)}</div>,

                        ]
                    }}
                    disposition={[2, 1, 1]}
                    tableHeader={["Fornecedor", "Valor", "Descontos", "Total"]}
                    enableContextMenu={false}
                    selected={selected}
                    selectedSetter={setSelected}
                ></Table>
            </div>
        </Content>
    </>
}