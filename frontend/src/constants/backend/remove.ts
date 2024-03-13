import { AxiosResponse } from "axios"
import { BackendResponse, api_protocol, api_address, api_port, api_v, backendAxios } from "./backend"

async function remove(tables: allTableNames, id: number): Promise<AxiosResponse<BackendResponse<undefined>>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await backendAxios.delete(full_address)
        return response
    } catch (error: any) {
        return error.response
    }
}
export { remove }