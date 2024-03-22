import { useContext, useEffect, useState } from "react";

import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import Table from "../../table/Table";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { WriteReceipt2PDF } from "./libReceipt";
import jsPDF from "jspdf";
import { openPDF, writeBox } from "../Relatorios/reportInternals/libraryReports";
import { bDate, getNextSaturday } from "../../../constants/dateUtils";
import { TRANSACTION_CLOSED, TRANSACTION_INVALID, TRANSACTION_OPEN } from "../../../constants/codes";
import beautyNumber from "../../../constants/numberUtils";

interface PerVendorResponse {
    fornecedor_nome: string, valor: number, tipo: boolean,id:number,bote_fornecedor_id:number
}

export default function ViewPerVendorReceipt() {
    const { defaultDataGet } = useContext(TableEngineContext)
    const [data, setData] = useState<PerVendorResponse[]>([])
    const [selected, setSelected] = useState<number[]>([])
    useEffect(() => {
        defaultDataGet("transacao", {
            include: "bote[]{fornecedor[]}",
            attributes: "bote.fornecedor_id,bote.fornecedor.nome,(sum)valor,tipo",
            group: "bote.fornecedor_id,bote.fornecedor.nome,tipo"
        }, (d: PerVendorResponse[]) => {
            d = d.map((each) => {return {...each,id:parseInt(`${each.bote_fornecedor_id}${each.tipo?1:0}`)}})
            setData(d)
        })

    }, [])
    console.log(data)
    function generateReceipts() {
        const pdf = new jsPDF()
        const selectedItems = data.filter(each => selected.includes(each.id ?? -1))
        const saturdayDate = getNextSaturday()
        let lastBox = writeBox(pdf, 0, -5, 0, 0)
        selectedItems.forEach(each => {
            const { valor, fornecedor_nome } = each
            if (lastBox.y2 + 85 > pdf.internal.pageSize.height) {
                pdf.addPage()
                lastBox = WriteReceipt2PDF(pdf, 5, valor, fornecedor_nome, saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")
                return;
            }
            lastBox = WriteReceipt2PDF(pdf, lastBox.y2 + 10, valor, fornecedor_nome, saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")

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
                    data={data as any}
                    tableItemHandler={(item: PerVendorResponse) => {
                        return [
                            item.fornecedor_nome,
                            item.tipo?"Saída":"Entrada",
                            <div className="text-right">{beautyNumber(item.valor)}</div>,
                           
                        ]
                    }}
                    disposition={[2, 1, 1]}
                    tableHeader={["Fornecedor", "Tipo", "Valor"]}
                    enableContextMenu={false}
                    selected={selected}
                    selectedSetter={setSelected}
                ></Table>
            </div>
        </Content>
    </>
}