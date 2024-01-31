import backend, { BackendTableComp } from "../../../constants/backend";

export async function saveEntradaStack(bote_id: number, obs: string, valorCompra: number, pesoCompra: number, valorVenda: number, pesoVenda: number, entradaItens: BackendTableComp[]) {
    alert('ok')
    const boteResponse = await backend.get('bote', { id: bote_id })
    if (boteResponse.error || !boteResponse.data || !Array.isArray(boteResponse.data) || !boteResponse.data[0]) return boteResponse
    const bote = boteResponse.data[0]
    const entradaResponse = await backend.create('entrada', {
        bote_id: parseInt("" + bote.id),
        fornecedor_id: parseInt("" + bote.fornecedor_id),
        usuario_id: 1,
        obs,
        valor_compra: valorCompra,
        peso_compra: pesoCompra,
        valor_venda: valorVenda,
        peso_venda: pesoVenda
    })
    if (entradaResponse.error || !entradaResponse.data || Array.isArray(entradaResponse.data) || !entradaResponse.data.id) return entradaResponse;

    const entrada_id = entradaResponse.data.id

    const parsedEntradaItens = entradaItens.map(each => {
        each.entrada_id = entrada_id
        return each
    })

    const entradaItensResponse = await backend.create("entrada_item", parsedEntradaItens)

    return { data: { entrada_id } }

}