import { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
// import CreationForm from "./FormBotes";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import { cashify } from "../../../constants/numberUtils";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { changeEntradaStatus } from "./internal";
import { globalPopupsContext } from "../../../App";

export default function ViewEntrada() {

    const { simpleSpawnInfo } = useContext(globalPopupsContext)
    const navigate = useNavigate()

    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [selected, setSelected] = useState<number[]>([])
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

    console.log(data)

    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "deletar"
    const invalidEntradas = () => {
        const onAcceptHandler = () => {
            changeEntradaStatus(selected, 1)
            setSelected([])
            setTimeout(() => {
                setUpdate(!update)
            }, 200)
        }
        simpleSpawnInfo(`Deseja mesmo invalidar ${selected.length} itens?`, onAcceptHandler, () => null)
    }

    // Quando é clicado em validar
    // const validEntradas = () => {
    //     changeEntradaStatus(selected, 0)
    //     setSelected([])
    //     setTimeout(() => {
    //         setUpdate(!update)
    //     }, 200)

    // }

    return <>
        <Bar />
        <SideBar />
        <Content>
            <SubTopBar>
                <ToolBarButton className="hover:bg-green-100" onClick={()=>navigate("/create/entrada")}><i>&#xea3b;</i> Criar</ToolBarButton>
                <ToolBarButton className="hover:bg-red-100" enabled={selected.length > 0} onClick={invalidEntradas}><i>&#xea0d;</i> Invalidar</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    onOrderChange={orderHandler}
                    selected={selected} onSelect={setSelected}
                    data={data}
                    disposition={[1, 3, 3, 3, 3]}
                    tableItemHandler={(item) => [
                        item.id,
                        item.bote?.nome,
                        `R$ ${cashify(item.valor_compra ?? -1)}`,
                        item.peso_compra + ' KG',
                        // item.status==0?<i title="Válido">&#xea10;</i>:<i title="Cancelado">&#xea0d;</i>,
                        bDate(item.updatedAt)
                    ]}
                    tableOrderKeys={["id", ["Bote", "nome"], "valor_compra", "peso_compra", "updatedAt"]}
                    tableHeader={[
                        "ID", "Bote", "Valor da Compra", "Peso da compra", "Ultima Atualização"
                    ]}
                />
            </div>
        </Content>
    </>
}