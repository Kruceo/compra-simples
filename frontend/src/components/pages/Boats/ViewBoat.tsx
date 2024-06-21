import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend from "../../../constants/backend/backend";
import CreationForm from "./FormBoat";

import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";


export default function ViewBoat() {
    const fornecedor_id = new URL(window.location.href).searchParams.get("fornecedor_id")

    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const { defaultDataGet, defaultDataDelete } = useContext(TableEngineContext)
    const [data, setData] = useState<boteProps[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({ include: 'fornecedor', fornecedor_id })

    const [loadingData, setLoadingData] = useState<boolean>(false)

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "bote"

    useEffect(() => {
        setLoadingData(true)
        defaultDataGet(table_to_manage, where, setData).then(() => setLoadingData(false))
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
        setGlobalPopupByKey("CreateForm",
            <CreationForm
                key={"FormBotes"}
                mode="creation"
                onCancel={() => setGlobalPopupByKey("CreateForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "editar"
    const editHandler = (id: number) => {
        const search = backend.utils.filterUsingID(data, id) as boteProps
        if (!search)
            return simpleSpawnInfo("Não é possivel selecionar o item escolhido.");

        const { nome, fornecedor } = search

        setGlobalPopupByKey("EditForm",
            <CreationForm
                key={'editingForm'}
                mode="editing"
                defaultValues={{ id, nome, fornecedor_id: fornecedor?.id ?? -1 }}
                onCancel={() => setGlobalPopupByKey("EditForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "deletar"
    const deleteHandler = (id: number) => defaultDataDelete(table_to_manage, id)
        .then(() => setUpdate(!update))

    const tableContextMenuButtons = [
        { element: <><i>&#xe905;</i>Editar</>, handler: editHandler },
        { element: <><i>&#xe9ac;</i>Remover</>, handler: deleteHandler }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content includeSubTopBar>

            <TableToolBar
                createHandler={createHandler}
                searchHandler={searchHandler}
            />
            <div className="w-full h-full">
                <Table
                    loading={loadingData}
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