import axios from "axios"

export const api_address = 'localhost'
export const api_protocol = 'http'
export const api_port = 8080
export const api_v = "v1"

export async function get(tables:string|"botes",where:{id:string|number},limit?:number){
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}`
    const response = await axios.get(full_address)
}