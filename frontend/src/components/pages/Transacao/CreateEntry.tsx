import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
import Table from "../../table/Table";
import FormSelection from "../../OverPageForm/FormSelection";

import { saveEntryStack } from "./internal";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import beautyNumber from "../../../constants/numberUtils";
import { ToolBarButton } from "../../Layout/SubTopBar";

export default function CreateEntry(props: { type: 0 | 1 }) {

    const navigate = useNavigate()
    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const [addedTransaçãoItensData, setAddedTransaçãoItensData] = useState<BackendTableComp[]>([])
    const [boteId, setBoteID] = useState(-1)
    const [obs, setObs] = useState("")
    const addTransaçãoItem = (Transação_item: BackendTableComp) => setAddedTransaçãoItensData([...addedTransaçãoItensData, { ...Transação_item, id: addedTransaçãoItensData.length + 1 }])
    const removeTransaçãoItem = (...Transação_item_ids: number[]) => setAddedTransaçãoItensData(addedTransaçãoItensData.filter(each => !Transação_item_ids.includes(each.id ?? -1)))

    const sumValor = () => {
        return addedTransaçãoItensData.reduce((acum, next) => {
            return acum + (next.valor_total ?? 0)
        }, 0)
    }
    const sumPeso = () => addedTransaçãoItensData.reduce((acum, next) => {
        return acum + (next.peso ?? 0)
    }, 0)

    const tableContextMenuButtons = [
        { element: <><i>&#xe9ac;</i>Remover</>, handler: removeTransaçãoItem }
    ]

    return <>
        <Bar />
        <SideBar />

        <Content>
            <form className="flex flex-col border-b border-borders p-4">
                <h2>Criação de {props.type == 0 ? "Entrada" : "Saída"}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full flex flex-col">
                        <RequiredLabel>Bote</RequiredLabel>
                        <FormSelection useTable="bote"
                            // onChange={(e)=>alert('ok')} 
                            onChange={(e) => setBoteID(parseInt(e.currentTarget.value))
                            }
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <RequiredLabel>Observação</RequiredLabel>
                        <FormInput
                            placeholder="Insira uma observação"
                            onChange={(e) => setObs(e.currentTarget.value)
                            }
                        />
                    </div>
                </div>
            </form>
            <div className="w-full min-h-64 p-4 border-b border-borders">
                <div className="flex mb-4">
                    <h2>Itens</h2>
                    <ToolBarButton className="ml-auto"
                        onClick={() => setGlobalPopupByKey("AddEntryProductForm", <AddProdutoForm onSubmit={addTransaçãoItem}
                            onCancel={() => setGlobalPopupByKey("AddEntryProductForm", null)}
                        />)}>
                        <i>&#xe905;</i> Adicionar
                    </ToolBarButton>
                </div>
                <div className="overflow-auto h-80">
                    <Table
                        data={addedTransaçãoItensData}
                        disposition={[1, 1, 1, 1]}
                        contextMenu={{ buttons: tableContextMenuButtons }}
                        tableHeader={["Produto", "Peso", "Preço/KG", "Valor total"]}
                        tableItemHandler={(item) => {
                            return [item.produto ? item.produto.nome : "Sem nome",
                            `${item.peso?.toLocaleString()} KG`,
                            `R$ ${(item.preco ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                            `R$ ${(item.valor_total ?? -1).toLocaleString(undefined, { minimumFractionDigits: 2 })}`]
                        }}
                        tableOrderKeys={[]}
                    />
                </div>
            </div>
            <div className="p-4 border-b border-borders">
                <h2 className="mb-4">Resumo</h2>
                <div className="border-borders border-b py-2">
                    <p>
                        <i>&#xea3b;</i> Valor Total: R$ {sumValor().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p>
                        <i>&#xe9b0;</i> Peso Total: {sumPeso().toLocaleString()} KG
                    </p>
                </div>
            </div>
            <div className="p-4">
                <button className="px-4 py-2 rounded-sm bg-submit text-submit-text font-bold hover:brightness-125"
                    onClick={async () => {
                        if (addedTransaçãoItensData.length === 0) return simpleSpawnInfo("É necessario adicionar algum item à transação.")

                        const response = await saveEntryStack(boteId, obs, sumValor(), sumPeso(), props.type, backend.utils.removeAttributeFromAll(addedTransaçãoItensData, "id"))

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


function AddProdutoForm(props: { onCancel: Function, onSubmit: (Transação_item: BackendTableComp) => any }) {
    const [error, setError] = useState("")
    const [preco, setPreco] = useState(0)
    const [peso, setPeso] = useState(0)
    const [produtoNome, setProdutoNome] = useState<null | string>(null)

    // O valor que aparecera no input preco quando o produto mudar;; o preço padrao de cada produto
    const onProdutoChange = (e: React.FormEvent<HTMLSelectElement>) => {

        const optionEl = e.currentTarget.selectedOptions.item(0)
        if (!optionEl) return;
        const dataItemStr = optionEl.getAttribute("data-item")
        if (!dataItemStr) return;
        const dataItem: BackendTableComp = JSON.parse(dataItemStr)
        const preco = dataItem.preco ? dataItem.preco.toString() : "-1"
        const produtoNome = dataItem.nome ? dataItem.nome.toString() : "Sem nome"

        const inputEl: HTMLInputElement | null = document.querySelector("input[name=preco]")
        if (!inputEl) return;
        inputEl.value = preco
        setPreco(parseFloat(preco))
        setProdutoNome(produtoNome)
    }

    const internalOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const d_produto_id = data.get("produto_id")
        const d_peso = data.get("peso")
        const d_preco = data.get("preco")

        if (!d_peso) return setError("peso")
        if (!d_preco) return setError("preco")
        if (!d_produto_id) return setError("produto_id")

        const produto_id = parseInt(d_produto_id.toString())
        const peso = parseFloat(d_peso.toString())
        const preco = parseFloat(d_preco.toString())

        props.onSubmit(
            {
                produto_id,
                peso,
                preco,

                valor_total: preco * peso,
                produto: { nome: produtoNome ?? "Sem nome" }
            })
        props.onCancel()
    }

    return <OverPageForm onSubmit={internalOnSubmit} title="Adicionar produto" onCancel={props.onCancel}>
        <RequiredLabel>Produto</RequiredLabel>
        <FormSelection key={'produto_id'} id="produto_id" onChange={onProdutoChange} name="produto_id" useTable="produto" errored={error == "produto_id"} />

        <RequiredLabel>Preço/KG</RequiredLabel>
        <FormInput name="preco" type="number" step={0.01} placeholder="Insira o preço" errored={error == "preco"} onChange={(e) => setPreco(parseFloat(e.target.value))} />

        <RequiredLabel>Peso(KG)</RequiredLabel>
        <FormInput name="peso" type="number" step={0.01} placeholder="Insira o peso" errored={error == "peso"} onChange={(e) => setPeso(parseFloat(e.target.value))} />

        <RequiredLabel>Valor Total</RequiredLabel>
        <p>
            {beautyNumber(peso * preco)}
        </p>

        <FormInput name="submit" type="submit" value={"Pronto"} />

    </OverPageForm>
}


