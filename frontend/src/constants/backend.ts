import axios, { Axios, AxiosResponse } from "axios"

export const api_address = 'localhost'
export const api_protocol = 'http'
export const api_port = 8080
export const api_v = "v1"

const backendAxios = axios.create({ withCredentials: true })

async function get(tables: string | "bote" | "produto" | "entrada" | "entrada_item" | "fornecedor",
    where: any,
    limit?: number): Promise<AxiosResponse<BackendResponse>> {

    let whereClause = { ...where }
    if (limit) whereClause['limit'] = limit

    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}?${obj2URLQuery(whereClause)}`
    try {
        const response = await backendAxios.get(full_address)
        return response
    } catch (error: any) {
        return error.response
    }

}

async function create(tables: string | "botes", data: BackendTableComp | BackendTableComp[]): Promise<AxiosResponse<BackendResponse>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}`
    try {
        const response = await backendAxios.post(full_address, data)
        return response
    } catch (error: any) {
        return error.response
    }
}

async function remove(tables: string | "botes", id: number): Promise<AxiosResponse<BackendResponse>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await backendAxios.delete(full_address)
        return response
    } catch (error: any) {
        return error.response
    }
}

async function edit(tables: string | "botes", id: number | string, content: BackendTableComp): Promise<AxiosResponse<BackendResponse>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await backendAxios.put(full_address, content)
        return response
    } catch (error: any) {
        return error.response
    }

}

interface BackendTableComp {
    // Default
    id?: number,
    createdAt?: any,
    updatedAt?: any,

    // Produto
    nome?: string,
    preco?: number,

    //Fornecedor  
    bote_id?: number,
    integracao_id?: number,

    //Entrada
    obs?: string,
    status?: number,
    fornecedor_id?: number,
    usuario_id?: number,
    valor_compra?: number
    peso_compra?: number
    valor_venda?: number
    peso_venda?: number

    //Entrada Item
    produto_id?: number,
    valor_total?: number,
    tipo?: number,
    peso?: number,
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
    data?: BackendTableComp | BackendTableComp[],
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
    return result[0]
}

function removeAttributeFromAll(data: BackendTableComp[], attribute: string): BackendTableComp[] {
    const newData = data.map(each => {
        const item: any = { ...each }
        delete item[attribute]
        return item
    })
    return newData
}

async function login(user: string, password: string) {
    const full_address = `${api_protocol}://${api_address}:${api_port}/auth/login`
    try {
        const response = await axios.post(full_address, { user, password })
        return response.data
    } catch (error: any) {
        return error.response.data
    }
}

const auth = {
    login
}

const utils = {
    filterUsingID,
    removeAttributeFromAll
}

export { get, create, remove, edit, utils, auth }
export default { get, create, remove, edit, utils, auth }

export type { BackendResponse, BackendTableComp }