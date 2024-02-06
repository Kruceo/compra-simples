import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
// import CreationForm from "./FormBotes";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { changeEntryStatus } from "./internal";
import { globalPopupsContext } from "../../../App";

export default function ViewEntry() {

    const { simpleSpawnInfo } = useContext(globalPopupsContext)
    const navigate = useNavigate()

    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({ include: "bote,usuario", status: 0 })

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "entrada"

    const data_getter = async () => await backend.get(table_to_manage, where)

    useEffect(() => {
        (async () => {
            const d = await data_getter()
            if (!d.data || !Array.isArray(d.data)) return;
            setData(d.data)
        })()
    }, [update])

    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "deletar"
    const invalidEntries = (id: number) => {
        const onAcceptHandler = async () => {
            await changeEntryStatus(id, 1)
            setTimeout(() => {
                setUpdate(!update)
            }, 150)
        }
        simpleSpawnInfo(`Deseja mesmo invalidar este item?`, onAcceptHandler, () => null)
    }

    const tableContextMenuButtons = [
        { element: <><i>&#xe9ac;</i>Invalidar</>, handler: invalidEntries }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content>
            <SubTopBar>
                <ToolBarButton className="hover:bg-green-100" onClick={() => navigate("/create/entrada")}><i>&#xea3b;</i> Criar</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[1, 6, 3, 3, 3, 3, 3]}
                    tableItemHandler={(item) => [
                        item.id,
                        item.bote?.nome,
                        `R$ ${(item.valor_compra ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        (item.peso_compra ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' KG',
                        `R$ ${(item.valor_venda ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        (item.peso_venda ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' KG',
                        // item.status==0?<i title="Válido">&#xea10;</i>:<i title="Cancelado">&#xea0d;</i>,
                        bDate(item.updatedAt)
                    ]}
                    tableOrderKeys={["id", ["Bote", "nome"], "valor_compra", "peso_compra", "valor_venda", "peso_venda", "updatedAt"]}
                    tableHeader={[
                        "ID", "Bote", "Valor da Compra", "Peso da Compra", "Valor da Venda", "Peso da Venda", "Ultima Atualização"
                    ]}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                />
            </div>
        </Content>
    </>
}