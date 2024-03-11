import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
// import CreationForm from "./FormBotes";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { changeEntryStatus } from "./internal";
import beautyNumber from "../../../constants/numberUtils";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import { BackendTableComp } from "../../../constants/backend";
import { TRANSACTION_INVALID, TRANSACTION_OPEN } from "../../../constants/codes";
import FilterEntryForm from "./FilterEntryForm";

export default function ViewEntry() {

    const { simpleSpawnInfo, setGlobalPopupByKey } = useContext(GlobalPopupsContext)
    const { defaultDataGet } = useContext(TableEngineContext)
    const navigate = useNavigate()

    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const blockedWhere = { include: "bote{fornecedor},usuario", limit: Math.round(window.innerHeight / 50) }
    const [where, setWhere] = useState<any>({ ...blockedWhere, status: TRANSACTION_OPEN, order: "updatedAt,DESC" })

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "transacao"
    useEffect(() => {
        defaultDataGet(table_to_manage, where, setData)
        window.addEventListener("scrollend", () => {
            console.log(window.scrollY + window.innerHeight, document.body.scrollHeight)
            if (window.scrollY + window.innerHeight > document.body.scrollHeight) {
                const limit = parseInt(where.limit) + 25
                setWhereKey("limit", limit.toString())
            }
        })
        console.log(data.length)
    }, [update, where])

    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "deletar"
    const invalidEntries = (id: number) => {
        const onAcceptHandler = async () => {
            await changeEntryStatus(id, TRANSACTION_INVALID)
            setTimeout(() => {
                setUpdate(!update)
            }, 150)
        }
        simpleSpawnInfo(`Deseja mesmo invalidar este item?`, onAcceptHandler, () => null)
    }



    const tableContextMenuButtons = [
        { element: <><i>&#xe922;</i>Detalhes</>, handler: (id: number) => navigate(`/details/transacao?id=${id}`) },
        { element: <><i>&#xe954;</i>Imprimir</>, handler: (id: number) => navigate(`/print/transacao?id=${id}`) },
        { element: <><i>&#xe9ac;</i>Invalidar</>, handler: invalidEntries }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content>
            <SubTopBar leftContent={<>
                <ToolBarButton onClick={() => setGlobalPopupByKey("TransactionFilter",
                    <FilterEntryForm whereSetter={(w) => setWhere({ ...blockedWhere, ...w })} onCancel={() => setGlobalPopupByKey("TransactionFilter", null)} />
                )}><i title="filtros">&#xe993;</i></ToolBarButton>

            </>}>
                <ToolBarButton className="hover:bg-green-100" onClick={() => navigate("/create/entrada")}><i>&#xea3b;</i> Criar</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[0.4, 1.5, 1.5, 1, 1, 1, 0.4]}
                    tableItemHandler={(item) => [
                        item.id,
                        item.bote?.nome,
                        item.bote?.fornecedor?.nome,
                        <div className="text-right">{beautyNumber(item.peso ?? -1)}</div>,
                        <div className="text-right">{beautyNumber(item.valor ?? -1)} </div>,
                        bDate(item.createdAt),
                        <div className="text-right">{item.tipo ? <i title="Saída" className="text-red-600">&#xea3f;</i> : <i title="Entrada" className="text-green-600">&#xea3b;</i>}</div>
                    ]}
                    tableOrderKeys={["id", ["Bote", "nome"], ["Bote", "Fornecedor", "nome"], "peso", "valor", "createdAt", "tipo"]}
                    tableHeader={[
                        "ID", "Bote", "Fornecedor", "Peso (KG)", "Valor", "Data", "T"
                    ]}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                />
            </div>
        </Content>
    </>
}