import axios from "axios"

export const api_address = 'localhost'
export const api_protocol = 'http'
export const api_port = 8080
export const api_v = "v1"

async function get(tables: string|"bote" | "produto" | "entrada" | "entrada_item" | "fornecedor",
    where: any,
    limit?: number): Promise<BackendResponse> {

    let whereClause = { ...where }
    if (limit) whereClause['limit'] = limit

    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}?${obj2URLQuery(whereClause)}`
    const response = await axios.get(full_address)
    return response.data
}

async function create(tables: string | "botes", data: BackendTableComp): Promise<BackendResponse> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}`
    const response = await axios.post(full_address, data)
    return response.data
}

async function remove(tables: string | "botes", id: number) {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await axios.delete(full_address)
        return response.data
    } catch (error: any) {
        if (error.response && error.response.data)
            return error.response.data
        else return {
            error: true,
            message: "Erro desconhecido. " + error
        }
    }
}

async function edit(tables: string | "botes", id: number | string, content: BackendTableComp): Promise<BackendResponse> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`
    const response = await axios.put(full_address, content)
    return response.data
}

interface BackendTableComp {

    id?: number | string,
    createdAt?: any,
    updatedAt?: any,
    nome?: string,
    preco?: number,
    bote_id?: number,
    integracao_id?: number,
    data?: any,
    obs?: string,
    valor_total?: number,
    peso_total?: number,
    tipo?: number,
    valor?: number,
    status?: string,
    fornecedor_id?: number,
    usuario_id?: number,
    peso?: number,
    desconto?: boolean,
    produto_id?: number,
    entrada_id?: number,
    fornecedores?: BackendTableComp[],
    fornecedor?: BackendTableComp,
    botes?: BackendTableComp[],
    bote?: BackendTableComp,
    entradas?: BackendTableComp[],
    entrada?: BackendTableComp,
    entrada_itens?: BackendTableComp[],
    entrada_item?: BackendTableComp,
    usuarios?: BackendTableComp[],
    usuario?: BackendTableComp,
    produtos?: BackendTableComp[],
    produto?: BackendTableComp,
}

interface BackendResponse {
    data?: BackendTableComp[],
    error?: boolean,
    message?: string
}

function obj2URLQuery(obj: Object) {
    let query = ''

    Object.entries(obj).forEach(each => {
        query += `${each[0]}=${each[1]}&`
    })
    return query.slice(0, query.length - 1)
}

function filterUsingID(data: BackendTableComp[], id: number) {
    const result = data.filter(each => { if (each.id == id) return each })
    console.log(result)
    return result[0]
}

const utils = {
    filterUsingID
}

export { get, create, remove, edit, utils }
export default { get, create, remove, edit, utils }

export type { BackendResponse, BackendTableComp }