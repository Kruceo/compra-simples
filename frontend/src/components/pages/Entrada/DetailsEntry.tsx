import { useContext, useEffect, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import Table from "../../table/Table";
import beautyNumber from "../../../constants/numberUtils";
import { GlobalPopupsContext } from "../../Contexts/PopupContext";
import { TableEngineContext } from "../../Contexts/TableEngineContext";

export default function DetailsEntry() {

    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")

    if (!id) return <SideBar />

    const [data, setData] = useState<BackendTableComp>()

    const { defaultDataGet } = useContext(TableEngineContext)

    useEffect(() => {
        defaultDataGet("entrada", { id, include: "entrada_item{produto}" }, (d: BackendTableComp[]) => setData(d[0]))
    }, [])
    console.log(data)
    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Produtos da Entrada - ID {id}</h2>
            <Table
                enableContextMenu={false}
                contextMenu={{ buttons: [] }}
                data={data?.entrada_itens ?? []}
                disposition={[1, 4, 2, 2, 2]}
                tableHeader={["ID", "Produto", "Preço", "Peso", "Valor Total"]}
                tableItemHandler={(item) => [
                    item.id,
                    item.produto?.nome,
                    <div className="w-full text-right">{beautyNumber(item.preco ?? -1)}</div>,
                    <div className="w-full text-right">{beautyNumber(item.peso ?? -1)}</div>,
                    <div className="w-full text-right">{beautyNumber(item.valor_total ?? -1)}</div>
                ]}
                onOrderChange={() => null}
                tableOrderKeys={[]}
            />
        </Content>
    </>
}