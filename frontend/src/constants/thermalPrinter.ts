import axios, { AxiosResponse } from "axios"

const api_protocol = 'http'
const api_address = '192.168.0.62'
const api_port = 8888

async function print(query: string[][]) {
    const full_address = `${api_protocol}://${api_address}:${api_port}/query`
    try {
        const response = await axios.post(full_address, { query })
        return response
    } catch (error: any) {
        return error.response
    }
}

async function getWidth(): Promise<AxiosResponse<{ width: number }>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/get/width`
    try {
        const response = await axios.get(full_address)
        return response
    } catch (error: any) {
        return error.response
    }
}

export default { getWidth, print }