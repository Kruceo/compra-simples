import { PropsWithChildren, createContext, useContext } from "react"
import backend from "../../constants/backend"
import { ErrorHandlerContext } from "./ErrorHandlerContext";
import PopupContext, { GlobalPopupsContext } from "./PopupContext";

interface ErrorHandlerContextType {
    defaultDataGet: (table: string, where: any, setter: Function) => Promise<void>;
    defaultDataDelete: (table: string, id: number) => Promise<void>;
}

export const TableEngineContext = createContext<ErrorHandlerContextType>({
    defaultDataGet: async () => Promise.resolve(),
    defaultDataDelete: async () => Promise.resolve()
})

export default function TableEngine(props: PropsWithChildren) {

    const { pageErrorHandler } = useContext(ErrorHandlerContext)
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)

    async function defaultDataGet(table: string, where: any, setter: Function) {
        const response = await backend.get(table, where)

        if (response.data && response.data.error && response.data.message)
            return pageErrorHandler(response)
        if (!response.data.data || !Array.isArray(response.data.data))
            return

        setter(response.data.data)
    }

    const defaultDataDelete = async (table: string, id: number) => {
        const promise:Promise<void> = new Promise((resolve) => {
            const onAcceptHandler = async () => {
                const response = await backend.remove(table, id)
                if (response.data.error)
                    pageErrorHandler(response)
                resolve()
            }
            const onCancelHandler = () => resolve()
            simpleSpawnInfo(`Deseja mesmo remover este item?`, onAcceptHandler, onCancelHandler)
        })
        return await promise
    }

    return <TableEngineContext.Provider value={{ defaultDataGet, defaultDataDelete }}>
        {props.children}
    </TableEngineContext.Provider>
}