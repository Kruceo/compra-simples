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
import FormInput from "../../OverPageForm/FormInput";
import FormSelection from "../../OverPageForm/FormSelection";

export default function ViewEntry() {

    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const { defaultDataGet } = useContext(TableEngineContext)
    const navigate = useNavigate()

    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({ include: "bote{fornecedor},usuario", status: 0, order: "updatedAt,DESC", limit: Math.round(window.innerHeight / 50) })

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
            await changeEntryStatus(id, 1)
            setTimeout(() => {
                setUpdate(!update)
            }, 150)
        }
        simpleSpawnInfo(`Deseja mesmo invalidar este item?`, onAcceptHandler, () => null)
    }

    const defaultFilterHandler = (key:string,e: React.FormEvent<HTMLSelectElement>) => {
        if (e.currentTarget.value == '') return setWhereKey(key, ">-1")
        setWhereKey(key, e.currentTarget.value)
    }

    const tableContextMenuButtons = [
        { element: <><i>&#xe922;</i>Detalhes</>, handler: (id: number) => navigate(`/details/transacao?id=${id}`) },
        { element: <><i>&#xe954;</i>Imprimir</>, handler: (id: number) => navigate(`/print/transacao?id=${id}`) },
        { element: <><i>&#xe9ac;</i>Invalidar</>, handler: invalidEntries }
    ]
    console.log(data)
    return <>
        <Bar />
        <SideBar />
        <Content>
            <SubTopBar leftContent={<>
            <i title="filtros">&#xe993;</i>
                <FormSelection useTable="fornecedor" onChange={(e)=>defaultFilterHandler('bote.fornecedor.id',e)}>
                    <option className="bg-background" value={""}>Qualquer Fornecedor</option>
                </FormSelection>
                <FormSelection useTable="bote" onChange={(e)=>defaultFilterHandler('bote.id',e)}>
                    <option className="bg-background" value={""}>Qualquer Bote</option>
                </FormSelection>
                <FormSelection useTable="usuario" onChange={(e)=>defaultFilterHandler('usuario.id',e)}>
                    <option className="bg-background" value={""}>Qualquer Usuário</option>
                </FormSelection>
            </>}>
                <ToolBarButton className="hover:bg-green-100" onClick={() => navigate("/create/entrada")}><i>&#xea3b;</i> Criar</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[1, 3, 3, 2, 2, 2, 2]}
                    tableItemHandler={(item) => [
                        item.id,
                        item.bote?.nome,
                        item.bote?.fornecedor?.nome,
                        <div className="text-right">{beautyNumber(item.peso ?? -1)}</div>,
                        <div className="text-right">{beautyNumber(item.valor ?? -1)} </div>,
                        item.tipo == 0 ? "Entrada" : "Saída",
                        // item.status==0?<i title="Válido">&#xea10;</i>:<i title="Cancelado">&#xea0d;</i>,
                        bDate(item.updatedAt)
                    ]}
                    tableOrderKeys={["id", ["Bote", "nome"], ["Bote", "Fornecedor", "nome"], "peso", "valor", "tipo", "updatedAt"]}
                    tableHeader={[
                        "ID", "Bote", "Fornecedor", "Peso (KG)", "Valor", "Tipo", "Ultima Atualização"
                    ]}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                />
            </div>
        </Content>
    </>
}