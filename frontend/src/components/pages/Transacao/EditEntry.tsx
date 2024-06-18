import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import Table from "../../table/Table";
import Button from "../../Layout/Button";
import TransitionItemAdder from "./TransitionAdder";
import backend from "../../../constants/backend/backend";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { useNavigate } from "react-router-dom";
import beautyNumber from "../../../constants/numberUtils";
import FormPrevisionInput from "../../OverPageForm/FormPrevisionInput";
import FormInput from "../../OverPageForm/FormInput";
import { date2input } from "../Relatorios/ViewPriceComparationReport";

export default function EditEntry() {
    const url = new URL(window.location.href);

    const transacao_id = url.searchParams.get("id")

    const { defaultDataGet } = useContext(TableEngineContext)
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const navigate = useNavigate()
    const [data, setData] = useState<transacaoProps>()
    const [toRemoveItens, setToRemoveItens] = useState<number[]>([])
    const [toAddItens, setToAddItens] = useState<transacaoitemProps[]>([])

    /**
     * Muda uma key como "bote_id" para o valor que quiser 
     * @param key 
     * @param value 
     */
    function changeKey(key: "bote_id" | "obs" | "valor" | "peso" | "usuario_id" | "createdAt", value: any) {
        if (!data) return
        const newData = { ...data }

        newData[key] = value as never

        setData(newData)
    }

    /** Remove um item do "data.transacao_itens" ou do state addedItens */
    function removeItem(id: number) {
        if (!data) return
        if (data.transacao_itens?.map(each => each.id).includes(id)) {
            data.transacao_itens = data.transacao_itens?.filter(each => each.id !== id)
            setToRemoveItens([id, ...toRemoveItens])
        }
        else {
            setToAddItens(toAddItens.filter(each => each.id !== id))
        }
    }

    function editItem(id: number, price?: number, weight?: number) {
        if (!data) return console.error("A transação não esta definida.")
        const newData: transacaoProps = { ...data }
        const newToAddItens = [...toAddItens]

        if (!newData.transacao_itens) return console.error("A transacao requisitada não incluiu na resposta os itens da transacao.")

        for (const item of newData.transacao_itens) {
            if (item.id !== id) continue

            item.preco = price ?? item.preco
            item.peso = weight ?? item.peso
            item.valor_total = item.peso * item.preco
            console.log(newData, item.peso, item.preco)
        }

        for (const item of newToAddItens) {
            if (item.id !== id) continue

            item.preco = price ?? item.preco
            item.peso = weight ?? item.peso
            item.valor_total = item.peso * item.preco
            console.log(newData, item.peso, item.preco)
        }


        setToAddItens(newToAddItens)
        setData(newData)
    }

    //Faz o fetch inicial que pega a transacao do id correspondente 
    useEffect(() => {
        defaultDataGet("transacao", { id: transacao_id, include: "transacao_item{produto[nome]}" }, (d: transacaoProps[]) => setData(d[0]))
    }, [])
    if (!data) return <><Bar /><SideBar /></>
    return <>
        <Bar />
        <SideBar />
        <Content>
            <section className="px-4 py-8 border-b border-borders">
                <h2>Editor de Transação</h2>
            </section>

            <section className="px-4 py-8 border-b border-borders flex">
                <div>
                    <RequiredLabel className="relative block">Bote</RequiredLabel>
                    <FormPrevisionInput className="w-96"
                        searchInTable="bote"
                        itemHandler={(item: boteProps) => item.nome}
                        onSubmit={() => null}
                        where={{}}
                        autoFocus
                        defaultValue={data.bote_id}
                        onChange={(e: boteProps | null) => {
                            if (e)
                                changeKey("bote_id", e.id)
                        }} />
                </div>
                <div className="ml-auto">
                    <RequiredLabel className="flex">Data</RequiredLabel>
                    <div className="block">

                        <FormInput type="date"
                            onChange={(e) => {
                                if (!e.currentTarget.valueAsDate) return
                                const date = e.currentTarget.valueAsDate
                                const now = new Date()
                                date.setHours(24)
                                date.setHours(now.getHours())
                                date.setMinutes(now.getMinutes())
                                date.setSeconds(now.getSeconds())
                                changeKey("createdAt", date.toISOString())
                            }}
                            defaultValue={date2input(new Date(data.createdAt))} />


                    </div>
                </div>
            </section>

            <section className="pl-4 py-0 border-b border-borders">
                <div className="grid grid-cols-3">
                    <div className="col-span-1 border-r border-borders pr-4 py-8">
                        <TransitionItemAdder productWhere={{ tipo: data.tipo }} onSubmit={(d) => setToAddItens([...toAddItens, d])}></TransitionItemAdder>
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
                                    // <p key={d.id}>{d.id}</p>,
                                    <p key={d.id}>{d.produto?.nome}</p>,
                                    <FormInput key={d.id} className="w-full" type="number" step={0.01} onChange={(e) => editItem(d.id, undefined, e.currentTarget.valueAsNumber)} defaultValue={d.peso} />,
                                    <FormInput key={d.id} className="w-full" type="number" step={0.01} onChange={(e) => editItem(d.id, e.currentTarget.valueAsNumber, undefined)} defaultValue={d.preco} />,
                                    <p className="text-end" key={d.id}>{beautyNumber(d.valor_total)} </p>
                                ]
                            }} >
                        </Table>
                    </div>
                </div>
            </section>


            <section className="px-4 py-8 border-b border-borders flex flex-col">
                <RequiredLabel>Observação</RequiredLabel>
                <textarea className="border-borders p-2 rounded-md border-input-default bg-transparent" name="obs" id="obs" cols={50} rows={2} defaultValue={data.obs}
                    onChange={(e) => changeKey("obs", e.target.value)}></textarea>
            </section>

            <section className="px-4 py-8 border-b border-borders">
                <Button onClick={() => simpleSpawnInfo("Deseja continuar?",
                    async () => {
                        const res = await finishEdit(data, toAddItens, toRemoveItens)
                        if (res.error) {
                            return simpleSpawnInfo(res.message ?? "Ocorreu um erro não reconhecido.")
                        }
                        navigate(`/print/transacao?id=${data.id}`)
                    },
                    () => null)
                }><i>&#xe962;</i> Finalizar</Button>
            </section>
        </Content >
    </>
}

async function finishEdit(data: transacaoProps, toAdd: transacaoitemProps[], toRemoveIds: number[]): Promise<{ error?: boolean, message?: string }> {
    if (!data.transacao_itens) return { error: true, message: "Os itens da transacao nao estao presentes." }

    // verificação pra ver se esta tudo ok com os itens de transacao como Nan em valores
    for (const item of data.transacao_itens) {
        if (Number.isNaN(item.valor_total)) return { error: true, message: "Valores nao permitidos nos itens da transacao." }
    }

    let totalValue = 0
    let totalWeight = 0
    //remove itens que estao na lista do toremove 
    const filtred = data.transacao_itens.filter(i => !toRemoveIds.includes(i.id))
    //junta os itens que estao no to add e no filtered 
    const fullAdded = [...filtred, ...toAdd]

    fullAdded.forEach(each => {
        totalWeight += each.peso
        totalValue += each.valor_total
    })

    // Cria todos os transacao itens
    // Mas primeiro retira os ids aleatorios para que possa ser gerado automaticamente no DB
    // Tambem coloca o transacao_id da transacao que está no state "Data"
    const createdItensRes = await backend.bulkCreate("transacao_item", toAdd.map((each: any) => {
        delete each.id
        each.transacao_id = data.id
        return each
    }))

    if (createdItensRes.data.error && createdItensRes.data.message) {
        return createdItensRes.data
    }

    // Edita os itens um a um
    const editRes = await backend.bulkEdit("transacao_item", data.transacao_itens)

    if (editRes.data.error && editRes.data.message)
        return editRes.data

    // mas isso deleta cada um dos itens um a um
    // se houver um erro, retorna     
    const removedItemRes = await backend.bulkRemove("transacao_item", toRemoveIds)
    if (removedItemRes.data.error) {
        return removedItemRes.data
    }

    //Por fim apenas edita a transacao com as somas e dados atualizados
    const transactionEditRes = await backend.edit("transacao", data.id, { valor: totalValue, peso: totalWeight, bote_id: data.bote_id, obs: data.obs, createdAt: data.createdAt })

    if (transactionEditRes.data.error) return { error: true, message: transactionEditRes.data.message }

    return { error: false }

}