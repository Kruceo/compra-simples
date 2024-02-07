import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
import CreationForm from "./FormBoat";
import { globalPopupsContext } from "../../../App";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";

export default function ViewBoat() {
    const { setGlobalPupupsByKey, simpleSpawnInfo } = useContext(globalPopupsContext)

    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({ include: 'fornecedor' })

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "bote"

    const data_getter = async () => await backend.get(table_to_manage, where)

    useEffect(() => {
        (async () => {

            const d = await data_getter()
            
            if (d.error && d.message)
                return simpleSpawnInfo(d.message)
            if (!d.data || !Array.isArray(d.data))
                return

            setData(d.data)
        })()
    }, [update])

    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "pesquisar"
    const searchHandler = (search: string) => {
        setWhereKey("nome", "^" + search)
        setUpdate(!update)
    }

    // Quando é clicado no botão "criar"
    const createHandler = () => {
        setGlobalPupupsByKey("CreateForm",
            <CreationForm
                key={"FormBotes"}
                mode="creation"
                onCancel={() => setGlobalPupupsByKey("CreateForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "editar"
    const editHandler = (id: number) => {
        const search = backend.utils.filterUsingID(data, id)
        if (!search)
            return simpleSpawnInfo("Não é possivel selecionar o item escolhido.");

        const { nome, fornecedor } = search

        setGlobalPupupsByKey("EditForm",
            <CreationForm
                key={'editingForm'}
                mode="editing"
                defaultValues={{ id, nome, fornecedor }}
                onCancel={() => setGlobalPupupsByKey("EditForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "deletar"
    const deleteHandler = (id: number) => {
        const onAcceptHandler = async () => {
            const response = await backend.remove(table_to_manage, id)
            if (response.error)
                simpleSpawnInfo(
                    response.message.includes("violates foreign key constraint")
                        ? "Existem itens no banco de dados que dependem deste."
                        : response.message)

            setTimeout(() => {
                setUpdate(!update)
            }, 200)
        }
        simpleSpawnInfo(`Deseja mesmo remover este item?`, onAcceptHandler, () => null)
    }

    const tableContextMenuButtons = [
        { element: <><i>&#xe905;</i>Editar</>, handler: editHandler },
        { element: <><i>&#xe9ac;</i>Remover</>, handler: deleteHandler }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content>
            
            <TableToolBar
                createHandler={createHandler}
                searchHandler={searchHandler}
            />
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    contextMenu={{ buttons: tableContextMenuButtons }}
                    data={data}
                    onOrderChange={orderHandler}
                    tableOrderKeys={["id", "nome", ["Fornecedor", "nome"], "updatedAt"]}
                    disposition={[1, 6, 4, 4]}
                    tableItemHandler={(item) => [
                        item.id, item.nome, item.fornecedor?.nome, bDate(item.updatedAt)
                    ]}
                    tableHeader={[
                        "ID", "Nome", "Fornecedor", "Ultima Atualização"
                    ]}
                />
            </div>
        </Content>
    </>
}