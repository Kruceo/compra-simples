import { useContext, useEffect, useInsertionEffect, useLayoutEffect, useRef, useState } from "react"
import { TableEngineContext } from "../GlobalContexts/TableEngineContext"
import backend, { BackendTableComp } from "../../constants/backend"
import { ErrorHandlerContext } from "../GlobalContexts/ErrorHandlerContext"
import PopupContext from "../GlobalContexts/PopupContext"

interface FormSelectionAttributes extends React.HTMLAttributes<HTMLSelectElement> {
    useTable?: string,
    errored?: boolean,
    name?: string
}

export default function FormSelection(props: FormSelectionAttributes) {

    const { pageErrorHandler } = useContext(ErrorHandlerContext)
    // const { pageErrorHandler } = useContext(PopupContext)

    const { errored, useTable, defaultValue, ...restProps } = props
    const [data, setData] = useState<BackendTableComp[]>([])
    const ref = useRef<HTMLSelectElement>(null)

    useInsertionEffect(() => {

        (async () => {
            if (!useTable) return;
            let res = await backend.get(useTable, {})

            if (res.data.error) {
                pageErrorHandler(res)
                return
            }

            let d = res.data.data

            if (!d || !Array.isArray(d)) return;

            d = d.sort((a) => {
                if (a.id == defaultValue) return -1
                else return 1
            })
            setData(d)

        })()
        setTimeout(() => {
            if (ref.current)
            ref.current.dispatchEvent(new Event("change", { bubbles: true }))
        }, 100);
        
    }, [])

    return <select ref={ref} {...restProps}
        // defaultValue={defaultValue}
        className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""} ${props.className}`}>
        {
            props.children
        }
        {
            data.map((item) => <option className="bg-background"
                key={item.id}
                // selected={item.id == defaultValue}
                data-item={JSON.stringify(item)}
                value={item.id}>
                {item.nome}
            </option>)
        }
    </select>

}   