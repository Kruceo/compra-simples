import axios, { AxiosResponse } from "axios"
import config from "../../config.json" assert {type: "json"}

const api_protocol = config.printer.protocol
const api_address = config.printer.address
const api_port = config.printer.port

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