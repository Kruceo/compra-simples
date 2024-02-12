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

export default function CreateEntry() {

    const navigate = useNavigate()
    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const [addedEntradaItensData, setAddedEntradaItensData] = useState<BackendTableComp[]>([])
    const [boteId, setBoteID] = useState(-1)
    const [obs, setObs] = useState("")
    const addEntradaItem = (entrada_item: BackendTableComp) => setAddedEntradaItensData([...addedEntradaItensData, { ...entrada_item, id: addedEntradaItensData.length + 1 }])
    const removeEntradaItem = (...entrada_item_ids: number[]) => setAddedEntradaItensData(addedEntradaItensData.filter(each => !entrada_item_ids.includes(each.id ?? -1)))

    const sumValores = (tipo: number) => {
        return addedEntradaItensData.reduce((acum, next) => {
            if (next.tipo == tipo)
                return acum + (next.valor_total ?? 0)
            return acum
        }, 0)
    }
    const sumPeso = (tipo: number) => addedEntradaItensData.reduce((acum, next) => {
        if (next.tipo == tipo) return acum + (next.peso ?? 0)
        return acum
    }, 0)

    const tableContextMenuButtons = [
        { element: <><i>&#xe9ac;</i>Remover</>, handler: removeEntradaItem }
    ]

    return <>
        <Bar />
        <SideBar />

        <Content>
            <form className="flex flex-col border-b border-borders p-4">
                <h2>Criação de Entrada</h2>
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
                        onClick={() => setGlobalPopupByKey("AddEntryProductForm", <AddProdutoForm onSubmit={addEntradaItem}
                            onCancel={() => setGlobalPopupByKey("AddEntryProductForm", null)}
                        />)}>
                        <i>&#xe905;</i> Adicionar
                    </ToolBarButton>
                </div>
                <div className="overflow-auto h-80">
                    <Table
                        data={addedEntradaItensData}
                        disposition={[1, 1, 1, 1, 1]}
                        contextMenu={{ buttons: tableContextMenuButtons }}
                        tableHeader={["Produto", "Tipo", "Peso", "Preço/KG", "Valor total"]}
                        tableItemHandler={(item) => {
                            return [item.produto ? item.produto.nome : "Sem nome",
                            item.tipo ? "Venda" : "Compra",
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
                        <i>&#xea3b;</i> Valor da Compra: R$ {sumValores(0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p>
                        <i>&#xe9b0;</i> Peso da Compra: {sumPeso(0).toLocaleString()} KG
                    </p>
                </div>
                <div className="py-2">
                    <p>
                        <i>&#xea3f;</i> Valor da Venda: R$ {sumValores(1).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p>
                        <i>&#xe9b0;</i> Peso da Venda: {sumPeso(1).toLocaleString()} KG
                    </p>
                </div>
            </div>
            <div className="p-4">
                <button className="px-4 py-2 rounded-sm bg-submit text-submit-text font-bold hover:brightness-125"
                    onClick={async () => {
                        if (addedEntradaItensData.length === 0) return simpleSpawnInfo("É necessario adicionar algum item à entrada.")

                        const response = await saveEntryStack(boteId, obs, sumValores(0), sumPeso(0), sumValores(1), sumPeso(1), backend.utils.removeAttributeFromAll(addedEntradaItensData, "id"))

                        if (response.error || !response.data)
                            return simpleSpawnInfo(response.message ?? "Houve um problema desconhecido ao criar uma entrada.")
                        if (!Array.isArray(response.data))
                            navigate('/print/entrada/' + response.data.entrada_id)
                    }}
                >
                    <i>&#xe962;</i> Finalizar
                </button>
            </div>
        </Content>
    </>
}


function AddProdutoForm(props: { onCancel: Function, onSubmit: (entrada_item: BackendTableComp) => any }) {
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
        const d_tipo = data.get("tipo")

        if (!d_peso) return setError("peso")
        if (!d_preco) return setError("preco")
        if (!d_tipo || d_tipo.toString() == "-1") return setError("tipo")
        if (!d_produto_id) return setError("produto_id")

        const produto_id = parseInt(d_produto_id.toString())
        const peso = parseFloat(d_peso.toString())
        const preco = parseFloat(d_preco.toString())
        const tipo = parseInt(d_tipo.toString())

        props.onSubmit(
            {
                produto_id,
                peso,
                preco,
                tipo,
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

        <RequiredLabel>Tipo</RequiredLabel>

        <FormSelection name="tipo" errored={error == "tipo"}>
            <option className="bg-background" value="-1">Escolha um tipo</option>
            <option className="bg-background hover:bg-red-500" value="0">Compra</option>
            <option className="bg-background hover:bg-red-500" value="1">Venda</option>
        </FormSelection>

        <RequiredLabel>Valor Total</RequiredLabel>
        <p>
            {beautyNumber(peso * preco)}
        </p>

        <FormInput name="submit" type="submit" value={"Pronto"} />

    </OverPageForm>
}


