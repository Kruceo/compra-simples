import { PropsWithChildren, createContext, useContext } from "react"
import backend from "../../constants/backend/backend"
import { ErrorHandlerContext } from "./ErrorHandlerContext";
import { GlobalPopupsContext } from "./PopupContext";

type queryClause = allTableTypes & { include?: string, attributes?: string, group?: string, limit?: number, order?: string }

export const TableEngineContext = createContext({
    defaultDataGet: async (table: allTableNames, where: Object, setter: Function) => Promise.resolve(),
    defaultDataDelete: async (table: allTableNames, id: number) => Promise.resolve()
})

export default function TableEngine(props: PropsWithChildren) {

    const { pageErrorHandler } = useContext(ErrorHandlerContext)
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)

    async function defaultDataGet(table: allTableNames, where: Object, setter: Function) {
        const response = await backend.get(table as any, where)

        if (response.data && response.data.error && response.data.message)
            return pageErrorHandler(response)
        if (!response.data.data)
            return

        setter(response.data.data)
    }

    const defaultDataDelete = async (table: allTableNames, id: number) => {
        const promise: Promise<void> = new Promise((resolve) => {
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