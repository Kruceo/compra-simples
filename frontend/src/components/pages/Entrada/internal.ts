import jsPDF from "jspdf";
import backend, { BackendTableComp } from "../../../constants/backend";


export async function saveEntryStack(bote_id: number, obs: string, valorCompra: number, pesoCompra: number, valorVenda: number, pesoVenda: number, entradaItens: BackendTableComp[]) {

    const boteResponse = await backend.get('bote', { id: bote_id })
    if (boteResponse.data.error || !boteResponse.data.data || !Array.isArray(boteResponse.data.data) || !boteResponse.data.data[0]) return boteResponse.data

    const bote = boteResponse.data.data[0]
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
    if (entradaResponse.data.error || !entradaResponse.data.data || Array.isArray(entradaResponse.data.data) || !entradaResponse.data.data.id) return entradaResponse.data;

    const entrada_id = entradaResponse.data.data.id

    const parsedEntradaItens = entradaItens.map(each => {
        each.entrada_id = entrada_id
        return each
    })

    const entradaItensResponse = await backend.create("entrada_item", parsedEntradaItens)

    if (entradaItensResponse.data.error) {
        return entradaItensResponse.data
    }

    return { data: { entrada_id } }

}

export async function changeEntryStatus(id: number, status: number) {
    backend.edit('entrada', id, { status })
}

