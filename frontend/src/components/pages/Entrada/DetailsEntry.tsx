import { useContext, useEffect, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { globalPopupsContext } from "../../../App";
import Table from "../../table/Table";

export default function DetailsEntry() {

    const { simpleSpawnInfo } = useContext(globalPopupsContext)

    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")

    if (!id) return <SideBar />

    const [data, setData] = useState<BackendTableComp>()

    useEffect(() => {
        (async () => {
            const response = await backend.get('entrada', { id, include: "entrada_item{produto}" })
            if (response.error && response.message) return simpleSpawnInfo(response.message)
            if (response.data && Array.isArray(response.data))
                setData(response.data[0])
        })()
    }, [])

    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Produtos da Entrada</h2>
            <Table contextMenu={{ buttons: [] }}
                data={data?.entrada_itens ?? []}
                disposition={[]}
                tableHeader={["Produto", "Preço", "Peso", "Valor Total"]}
                tableItemHandler={(item) => [
                    item.produto?.nome,
                    "R$ " + (item.preco ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 }),
                    (item.peso ?? -1).toLocaleString(),
                    "R$ " + (item.valor_total ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 })]}
                onOrderChange={() => null}
                tableOrderKeys={[]}
            />
        </Content>
    </>
}