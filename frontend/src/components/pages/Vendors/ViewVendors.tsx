import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend from "../../../constants/backend/backend";
import CreationForm from "./FormVendors";
import { useNavigate } from 'react-router-dom'

import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";

export default function ViewVendors() {
    const navigate = useNavigate()
    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const [data, setData] = useState<fornecedorProps[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({})

    const [loadingData, setLoadingData] = useState<boolean>(false)

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "fornecedor"

    const { defaultDataGet, defaultDataDelete } = useContext(TableEngineContext)
    useEffect(() => {
        setLoadingData(true)
        defaultDataGet(table_to_manage, where, setData)
            .then(() => setLoadingData(false))
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
                key={"FormFornecedor"}
                mode="creation"
                onCancel={() => setGlobalPopupByKey("CreateForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "editar"
    const editHandler = (id: number) => {
        const search = backend.utils.filterUsingID(data, id) as fornecedorProps
        if (!search)
            return simpleSpawnInfo("Não é possivel selecionar o item escolhido.");

        const { nome } = search
        setGlobalPopupByKey("EditForm",
            <CreationForm
                key={'editingForm'}
                mode="editing"
                defaultValues={{ id, nome }}
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
        { element: <><i>&#xe969;</i>Botes</>, handler: (id: number) => navigate("/view/bote?fornecedor_id=" + id) },
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
                <Table loading={loadingData}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[1, 10, 4]}
                    tableItemHandler={(item) => [
                        item.id, item.nome, bDate(item.updatedAt)
                    ]}
                    tableOrderKeys={["id", "nome", "updatedAt"]}
                    tableHeader={[
                        "ID", "Nome", "Ultima Atualização"
                    ]}
                />
            </div>
        </Content>
    </>
}