import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import SideBar from "../../Layout/SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
import Table from "../../table/Table";
import FormSelection from "../../OverPageForm/FormSelection";
import SubTopBar from "../../Layout/SubTopBar";
import { cashify } from "../../../constants/numberUtils";
import { globalPopupsContext } from "../../../App";
import { saveEntradaStack } from "./internal";

export default function CreateEntrada() {

    const { setGlobalPupupsByKey, simpleSpawnInfo } = useContext(globalPopupsContext)

    const [addedEntradaItensData, setAddedEntradaItensData] = useState<BackendTableComp[]>([])
    const [selectedEntradaItens, setSelectedEntradaItens] = useState<number[]>([])
    const [boteId, setBoteID] = useState(-1)
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

    return <>
        <Bar />
        <SideBar />

        <Content>
            <form className="flex flex-col border-b border-borders p-4">
                <h2>Criação de Entrada</h2>
                <RequiredLabel>Bote</RequiredLabel>
                <FormSelection useTable="bote"
                    // onChange={(e)=>alert('ok')} 
                    onChange={(e) => setBoteID(parseInt(e.currentTarget.value))
                    }
                />
            </form>
            <div className="w-full min-h-64 p-4 border-b border-borders">
                <div className="flex mb-4">
                    <h2>Itens</h2>
                    <button className="px-4 py-2 ml-auto rounded-sm font-bold hover:bg-red-100"
                        onClick={()=>{removeEntradaItem(...selectedEntradaItens);setSelectedEntradaItens([])}}>
                        <i>&#xe9ac;</i> Remover
                    </button>
                    <button className="px-4 py-2 rounded-sm font-bold hover:bg-green-100"
                        onClick={() => setGlobalPupupsByKey(5, <AddProdutoForm onSubmit={addEntradaItem}
                            onCancel={() => setGlobalPupupsByKey(5, null)}
                        />)}>
                        <i>&#xe905;</i> Adicionar
                    </button>
                </div>
                <div className="overflow-auto h-80">
                    <Table data={addedEntradaItensData}
                        disposition={[1, 1, 1, 1, 1]}
                        selected={selectedEntradaItens} onSelect={setSelectedEntradaItens}
                        tableHeader={["Produto", "Tipo", "Peso", "Preço/KG", "Valor total"]}
                        tableItemHandler={(item) => {
                            return [item.produto ? item.produto.nome : "Sem nome", item.tipo ? "Venda" : "Compra", `${item.peso} KG`, `R$ ${cashify(item.preco ?? -1)}`, `R$ ${cashify(item.valor_total ?? -1)}`]
                        }}
                        tableOrderKeys={[]}
                    />
                </div>
            </div>
            <div className="p-4 border-b border-borders">
                <h2 className="mb-4">Resumo</h2>
                <div className="border-borders border-b py-2">
                    <p><i>&#xea3b;</i> Valor da Compra: R$ {cashify(sumValores(0))}</p>
                    <p><i>&#xe9b0;</i> Peso da Compra: {sumPeso(0)} KG</p>
                </div>
                <div className="py-2">
                    <p><i>&#xea3f;</i> Valor da Venda: R$ {cashify(sumValores(1))}</p>
                    <p><i>&#xe9b0;</i> Peso da Venda: {sumPeso(1)} KG</p>
                </div>
            </div>
            <div className="p-4">
                <button className="px-4 py-2 rounded-sm bg-green-300 font-bold hover:brightness-125"
                    onClick={async () => {
                        if(addedEntradaItensData.length===0)return simpleSpawnInfo("É necessario adicionar algum item à entrada.")
                        
                        const response = await saveEntradaStack(boteId, '', sumValores(0), sumPeso(0), sumValores(1), sumPeso(1), addedEntradaItensData)
                        if (response.error || !response.data || Array.isArray(response.data))
                            return simpleSpawnInfo(response.message ?? "Houve um problema desconhecido ao criar uma entrada.")
                        window.location.assign('/print/entrada/' + response.data.entrada_id)
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
        if (!d_tipo) return setError("tipo")
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

    // useEffect(() => {
    //     const produtoIdEl = document.querySelector("[name=produto_id]")

    //     if (!produtoIdEl) return;
    //     setTimeout(() => produtoIdEl.dispatchEvent(new Event("change", { bubbles: true })), 100)

    // }, [])

    return <OverPageForm onSubmit={internalOnSubmit} title="Adicionar produto" onCancel={props.onCancel}>
        <RequiredLabel>Produto</RequiredLabel>
        <FormSelection id="produto_id" onChange={onProdutoChange} name="produto_id" useTable="produto" errored={error == "produto_id"} />

        <RequiredLabel>Preço/KG</RequiredLabel>
        <FormInput name="preco" type="float" placeholder="E.g 10.5" errored={error == "preco"} onChange={(e) => setPreco(parseFloat(e.target.value))} />

        <RequiredLabel>Peso(KG)</RequiredLabel>
        <FormInput name="peso" type="float" placeholder="E.g 20.5" errored={error == "peso"} onChange={(e) => setPeso(parseFloat(e.target.value))} />

        <RequiredLabel>Tipo</RequiredLabel>
        <FormSelection name="tipo" errored={error == "tipo"}>
            <option value="0">Compra</option>
            <option value="1">Venda</option>
        </FormSelection>

        <RequiredLabel>Valor Total</RequiredLabel>
        <p>R$ {cashify(peso * preco)}</p>

        <FormInput name="submit" type="submit" value={"Pronto"} />

    </OverPageForm>
}