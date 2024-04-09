import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import FormSelection from "../../OverPageForm/FormSelection";
import Table from "../../table/Table";
import Button from "../../Layout/Button";
import TransitionItemAdder from "./TransitionAdder";
import backend from "../../../constants/backend/backend";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { useNavigate } from "react-router-dom";
import beautyNumber from "../../../constants/numberUtils";

export default function EditEntry() {
    const url = new URL(window.location.href);

    const transacao_id = url.searchParams.get("id")

    const { defaultDataGet } = useContext(TableEngineContext)
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const navigate = useNavigate()
    const [data, setData] = useState<transacaoProps>({ bote_id: -1, createdAt: "-1", updatedAt: "-1", id: -1, obs: "", peso: -1, status: -1, tipo: 0, usuario_id: -1, valor: -1 })
    const [toRemoveItens, setToRemoveItens] = useState<number[]>([])
    const [toAddItens, setToAddItens] = useState<transacaoitemProps[]>([])

    function changeKey(key: "bote_id" | "obs" | "valor" | "peso" | "usuario_id", value: any) {
        let newData = { ...data }

        newData[key] = value as never

        setData(newData)
    }

    function removeItem(id: number) {

        if (data.transacao_itens?.map(each => each.id).includes(id)) {
            data.transacao_itens = data.transacao_itens?.filter(each => each.id !== id)
            setToRemoveItens([id, ...toRemoveItens])
        }
        else {
            setToAddItens(toAddItens.filter(each => each.id !== id))
        }
    }

    useEffect(() => {
        defaultDataGet("transacao", { id: transacao_id, include: "transacao_item{produto[nome]}" }, (d: transacaoProps[]) => setData(d[0]))
    }, [])
    if (!data) return ""
    return <>
        <Bar />
        <SideBar />
        <Content>
            <div className="p-4">
                <div className="flex flex-col">
                    <RequiredLabel className="relative block">Bote</RequiredLabel>
                    <FormSelection className="w-64" useTable="bote" defaultValue={data?.bote_id} onChange={(e) => {
                        changeKey("bote_id", parseInt(e.currentTarget.value))
                    }} />
                </div>
                <div className="grid grid-cols-3 mt-8">
                    <div className="col-span-1 border-r border-borders pr-4">
                        <TransitionItemAdder onSubmit={(d) => setToAddItens([...toAddItens, d])}></TransitionItemAdder>
                    </div>
                    <div className="col-span-2">
                        <Table
                            contextMenu={{
                                buttons: [{
                                    element: "Remover",
                                    handler: removeItem
                                }]
                            }}
                            data={[...data.transacao_itens ?? [], ...toAddItens]} disposition={[1]} tableHeader={["Nome", "Peso", "Preço", "Total"]} tableItemHandler={(d: transacaoitemProps) => {
                                return [
                                    <div>{d.produto?.nome}</div>,
                                    <p className="text-end">{beautyNumber(d.peso)}</p>,
                                    <p className="text-end">{beautyNumber(d.preco)}</p>,
                                    <p className="text-end">{beautyNumber(d.valor_total)}</p>
                                ]
                            }} >

                        </Table>
                    </div>
                </div>
                <div className="mt-4 border-borders border-t pt-4 flex flex-col">
                    <RequiredLabel>Observação</RequiredLabel>
                    <textarea name="obs" id="obs" cols={50} rows={2} defaultValue={data.obs}
                        onChange={(e) => changeKey("obs", e.target.value)}></textarea>
                </div>
                <div className="mt-8 pt-8 flex border-borders border-t">
                    <Button onClick={() => simpleSpawnInfo("Deseja continuar?",
                        async () => {
                            const res = await finishEdit(data, toAddItens, toRemoveItens)
                            if (res.error) {
                                return simpleSpawnInfo(res.message ?? "Ocorreu um erro não reconhecido.")
                            }
                            navigate(`/details/transacao?id=${data.id}`)
                        },
                        () => null)
                    }><i>&#xe962;</i> Finalizar</Button>
                </div>
                {/* <pre>
                    <code>
                        {JSON.stringify(data ?? "", null, 2)}
                        <br></br>
                        ------------------------------------------------------------------------
                        <br></br>
                        {JSON.stringify(toRemoveItens ?? "", null, 2)}
                        <br></br>
                        ------------------------------------------------------------------------
                        <br></br>
                        {JSON.stringify(toAddItens ?? "", null, 2)}
                    </code>
                </pre> */}
            </div>
        </Content >
    </>
}

async function finishEdit(data: transacaoProps, toAdd: transacaoitemProps[], toRemoveIds: number[]): Promise<{ error?: boolean, message?: string }> {
    if (!data.transacao_itens) return { error: true, message: "no transactions itens." }

    let totalValue = 0
    let totalWeight = 0
    const filtred = data.transacao_itens.filter(i => !toRemoveIds.includes(i.id))

    const fullAdded = [...filtred, ...toAdd]

    fullAdded.forEach(each => {
        totalWeight += each.peso
        totalValue += each.valor_total
    })

    const createdItensRes = await backend.create("transacao_item", toAdd.map((each: any) => {
        delete each.id
        each.transacao_id = data.id
        return each
    }))

    if (createdItensRes.data.error && createdItensRes.data.message) {
        return createdItensRes.data
    }

    for (const id of toRemoveIds) {
        const removedItemRes = await backend.remove("transacao_item", id)
        if (removedItemRes.data.error) {
            return removedItemRes.data
            break
        }
    }

    const transactionEditRes = await backend.edit("transacao", data.id, { valor: totalValue, peso: totalWeight, bote_id: data.bote_id, obs: data.obs })

    if (transactionEditRes.data.error) return { error: true, message: transactionEditRes.data.message }

    return { error: false }

}