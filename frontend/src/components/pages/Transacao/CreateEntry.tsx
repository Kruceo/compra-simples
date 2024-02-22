import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
import { saveEntryStack } from "./internal";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import beautyNumber from "../../../constants/numberUtils";
import FormPrevisionInput from "../../OverPageForm/FormPrevisionInput";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import Table from "../../table/Table";
import TransitionItemAdder from "./TransitionAdder";

export default function CreateEntry(props: { type: 0 | 1 }) {

    const navigate = useNavigate()
    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const [addedTransitionItensData, setAddedTransitionItensData] = useState<BackendTableComp[]>([])
    const [transitionBoat, setTransitionBoat] = useState<BackendTableComp>()
    const [obs, setObs] = useState("")
    const addTransitionItem = (Transação_item: BackendTableComp) => setAddedTransitionItensData([...addedTransitionItensData, { ...Transação_item, id: addedTransitionItensData.length + 1 }])
    const removeTransitionItem = (...Transação_item_ids: number[]) => setAddedTransitionItensData(addedTransitionItensData.filter(each => !Transação_item_ids.includes(each.id ?? -1)))

    const sumValor = () => {
        return addedTransitionItensData.reduce((acum, next) => {
            return acum + (next.valor_total ?? 0)
        }, 0)
    }
    const sumPeso = () => addedTransitionItensData.reduce((acum, next) => {
        return acum + (next.peso ?? 0)
    }, 0)

    const tableContextMenuButtons = [
        { element: <><i>&#xe9ac;</i>Remover</>, handler: removeTransitionItem }
    ]

    return <>
        <Bar />
        <SideBar />

        <Content>
            <div className="px-4 py-8 flex flex-col border-b border-borders min-h-44">
                <h2>Criação de {props.type == 0 ? "Entrada" : "Saída"}</h2>
                <div className="grid grid-cols-2">
                    <div className="w-full">
                        <RequiredLabel>Bote</RequiredLabel>

                        <FormPrevisionInput
                            placeholder="Insira o codigo do bote"
                            onChange={(value) => {
                                if (value)
                                    setTransitionBoat(value)
                            }}
                            searchInTable="bote"
                            where={{ include: 'fornecedor' }}
                            itemHandler={(item) => `${item.id} - ${item.nome} | ${item.fornecedor?.nome}`}
                            onSubmit={() => null}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3">
                <h2 className="col-span-3 p-4">Produtos</h2>
                <div className="h-full border-r border-borders">
                    <TransitionItemAdder onSubmit={(item) => addTransitionItem(item)} />
                </div>
                <div className="col-span-2">
                    <Table
                        contextMenu={{ buttons: tableContextMenuButtons }}
                        data={addedTransitionItensData}
                        disposition={[]}
                        tableHeader={['Produto', "Preço", "Peso", "Total"]}
                        tableItemHandler={(item) => [
                            item.produto?.nome,
                            <p className="text-end">{beautyNumber(item.preco ?? -1)}</p>,
                            <p className="text-end">{beautyNumber(item.peso ?? -1)}</p>,
                            <p className="text-end">{beautyNumber(item.valor_total ?? -1)}</p>]}
                    />
                </div>
            </div>
            <div className="px-4 py-8 border-b border-t border-borders">
                <h2 className="mb-4">Resumo</h2>
                <div>
                    <p>
                        <i>&#xea3b;</i> Valor Total: R$ {sumValor().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p>
                        <i>&#xe9b0;</i> Peso Total: {sumPeso().toLocaleString()} KG
                    </p>
                </div>
            </div>
            <div className="px-4 py-8 border-b border-borders flex flex-col">
                <RequiredLabel>Observação</RequiredLabel>
                <FormInput
                    placeholder="Insira uma observação"
                    onChange={(e) => setObs(e.currentTarget.value)
                    }
                />
            </div>
            <div className="p-4">
                <button className="px-4 py-2 rounded-sm bg-submit text-submit-text font-bold hover:brightness-125"
                    onClick={async () => {
                        //Errors
                        if (addedTransitionItensData.length === 0) return simpleSpawnInfo("É necessario adicionar algum item à transação.")
                        if (!transitionBoat || !transitionBoat.id) return simpleSpawnInfo("É necessario selecionar um bote.")

                        const response = await saveEntryStack(transitionBoat.id, obs, sumValor(), sumPeso(), props.type, backend.utils.removeAttributeFromAll(addedTransitionItensData, "id"))

                        if (response.error || !response.data)
                            return simpleSpawnInfo(response.message ?? "Houve um problema desconhecido ao criar uma Transação.")
                        if (!Array.isArray(response.data))
                            navigate('/print/transacao/' + response.data.transacao_id)
                    }}
                >
                    <i>&#xe962;</i> Finalizar
                </button>
            </div>
        </Content>
    </>
}
