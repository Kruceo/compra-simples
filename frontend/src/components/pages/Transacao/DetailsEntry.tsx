import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import Table from "../../table/Table";
import beautyNumber from "../../../constants/numberUtils";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";

export default function DetailsEntry() {

    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")

    if (!id) return <SideBar />

    const [data, setData] = useState<transacaoProps>()

    const { defaultDataGet } = useContext(TableEngineContext)

    useEffect(() => {
        defaultDataGet("transacao", { id, include: "transacao_item{produto}" }, (d: transacaoProps[]) => setData(d[0]))
    }, [])
    console.log(data)
    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Transação {id}</h2>
            <h3 className="px-4">Observação:</h3>
            <p className="px-4 mb-4 border-borders border mx-4 mt-2 p-4 rounded-sm opacity-50">{data?.obs}</p>
            <h3 className="px-4">Itens:</h3>
            <Table
                enableContextMenu={false}
                contextMenu={{ buttons: [] }}
                data={data?.transacao_itens ?? []}
                disposition={[0.5, 3, 2, 2, 2]}
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