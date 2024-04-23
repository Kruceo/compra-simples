import backend from "../../../constants/backend/backend";

interface saveEntryStackResponse {
    error?: boolean,
    message?: string,
    data?: Partial<transacaoitemProps>
}

export async function saveEntryStack(bote_id: number, obs: string, valor: number, peso: number, tipo: 0 | 1, transacaoItens: transacaoitemProps[]): Promise<saveEntryStackResponse> {

    const boteResponse = await backend.get('bote', { id: bote_id })
    if (boteResponse.data.error || !boteResponse.data.data || !Array.isArray(boteResponse.data.data) || !boteResponse.data.data[0]) return { message: boteResponse.data.message, error: true }

    const bote = boteResponse.data.data[0]
    const transacaoResponse = await backend.create('transacao', {
        bote_id: parseInt("" + bote.id),
        fornecedor_id: parseInt("" + bote.fornecedor_id),
        usuario_id: 1,
        obs,
        tipo,
        valor: valor,
        peso: peso
    })
    if (transacaoResponse.data.error || !transacaoResponse.data.data || Array.isArray(transacaoResponse.data.data) || !transacaoResponse.data.data.id) return { message: transacaoResponse.data.message, error: true };

    const transacao_id = transacaoResponse.data.data.id

    const parsedTransacaoItens = transacaoItens.map(each => {
        each.transacao_id = transacao_id
        return each
    })

    const transacaoItensResponse = await backend.bulkCreate("transacao_item", parsedTransacaoItens)

    if (transacaoItensResponse.data.error) {
        return { error: true, message: transacaoItensResponse.data.message }
    }

    return { error: false, message: undefined, data: { transacao_id: transacao_id, } }

}

export async function changeEntryStatus(id: number, status: number) {
    backend.edit('transacao', id, { status })
}

