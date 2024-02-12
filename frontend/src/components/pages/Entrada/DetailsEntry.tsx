import { useContext, useEffect, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import Table from "../../table/Table";
import beautyNumber from "../../../constants/numberUtils";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";

export default function DetailsEntry() {

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
            <h2 className="p-4">Entrada {id}</h2>
            <h3 className="px-4">Observação:</h3>
            <p className="px-4 mb-4">{data?.obs}</p>
            <h3 className="px-4">Itens:</h3>
            <Table
                enableContextMenu={false}
                contextMenu={{ buttons: [] }}
                data={data?.entrada_itens ?? []}
                disposition={[0.5, 4, 2, 2, 2]}
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