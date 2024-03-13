import { useContext, useEffect, useState } from "react";

import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import Table from "../../table/Table";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { WriteReceipt2PDF } from "./libReceipt";
import jsPDF from "jspdf";
import { openPDF, writeBox } from "../Relatorios/libraryReports";
import { getNextSaturday } from "../../../constants/dateUtils";
import { TRANSACTION_CLOSED, TRANSACTION_INVALID, TRANSACTION_OPEN } from "../../../constants/codes";
import beautyNumber from "../../../constants/numberUtils";

export default function ViewPerTransReceipt() {
    const { defaultDataGet } = useContext(TableEngineContext)
    const [data, setData] = useState<(transacaoProps & { bote: boteProps & { fornecedor: fornecedorProps } })[]>([])
    const [selected, setSelected] = useState<number[]>([])
    useEffect(() => {
        defaultDataGet("transacao", { include: "bote{fornecedor}", tipo: 0, status: TRANSACTION_OPEN }, setData)
        console.log(data)
    }, [])

    function generateReceipts() {
        const pdf = new jsPDF()
        const selectedItems = data.filter(each => selected.includes(each.id ?? -1))
        const saturdayDate = getNextSaturday()
        let lastBox = writeBox(pdf, 0, -5, 0, 0)
        selectedItems.forEach(each => {
            const { valor, bote } = each
            if (lastBox.y2 + 85 > pdf.internal.pageSize.height) {
                pdf.addPage()
                lastBox = WriteReceipt2PDF(pdf, 5, valor, bote.fornecedor?.nome ?? "Não definido", saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")
                return;
            }
            lastBox = WriteReceipt2PDF(pdf, lastBox.y2 + 10, valor, bote.fornecedor?.nome ?? "Não definido", saturdayDate, "PAGTO FORNECIMENTO DE MERCADORIAS")

        })
        openPDF(pdf)
    }

    return <>
        <Bar></Bar>
        <SideBar></SideBar>
        <Content>
            <SubTopBar>
                <ToolBarButton enabled={selected.length > 0} onClick={generateReceipts}>Gerar Recibos</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    data={data as transacaoProps[]}
                    tableItemHandler={(item: any) => {
                        let status = "Desconhecido"
                        switch (item.status) {
                            case TRANSACTION_OPEN:
                                status = "Aberto"
                                break;
                            case TRANSACTION_CLOSED:
                                status = "Fechado"
                                break;
                            case TRANSACTION_INVALID:
                                status = "Inválido"
                                break;
                            default:
                                break;
                        }
                        return [
                            item.id,
                            item.bote.fornecedor.nome,
                            status,
                            <div className="text-right">{beautyNumber(item.valor)}</div>
                        ]
                    }}
                    disposition={[0.3, 1, 0.3, 1]}
                    tableHeader={["ID", "Fornecedor", "Status", "Valor"]}
                    enableContextMenu={false}
                    selected={selected}
                    selectedSetter={setSelected}
                ></Table>
            </div>
        </Content>
    </>
}