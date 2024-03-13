import { AxiosResponse } from "axios"
import { BackendResponse, api_protocol, api_address, api_port, api_v, backendAxios } from "./backend"

async function edit(tables: "bote", where: number, content: Partial<boteProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "transacao", where: number, content: Partial<transacaoProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "transacao_item", where: number, content: Partial<transacaoitemProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "produto", where: number, content: Partial<produtoProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "usuario", where: number, content: Partial<usuarioProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "fornecedor", where: number, content: Partial<fornecedorProps>): Promise<AxiosResponse<BackendResponse<undefined>>>

async function edit(tables: allTableNames, id: number, content: Partial<allTableTypes>): Promise<AxiosResponse<BackendResponse<undefined>>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await backendAxios.put(full_address, content)
        return response
    } catch (error: any) {
        return error.response
    }

}

export { edit }