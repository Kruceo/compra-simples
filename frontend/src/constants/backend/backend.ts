import axios, { AxiosResponse } from "axios"
import { get } from './get'
import { create } from "./create"
import { edit } from "./edit"
import { remove } from "./remove"
export const api_address = '192.168.0.62'
export const api_protocol = 'http'
export const api_port = 8080
export const api_v = "v1"

export const backendAxios = axios.create({ withCredentials: true })





interface BackendResponse<T> {
    error?: boolean,
    message?: string
    data?: T
}

function filterUsingID(data: allTableTypes[], id: number) {
    const result = data.filter(each => { if (each.id == id) return each })
    return result[0]
}

function removeAttributeFromAll<T>(data: T[], attribute: string): Partial<T>[] {
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

export type { BackendResponse }
