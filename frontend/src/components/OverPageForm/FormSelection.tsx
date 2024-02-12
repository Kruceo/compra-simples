import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { TableEngineContext } from "../GlobalContexts/TableEngineContext"
import backend, { BackendTableComp } from "../../constants/backend"

interface FormSelectionAttributes extends React.HTMLAttributes<HTMLSelectElement> {
    useTable?: string,
    errored?: boolean,
    name?: string
}

export default function FormSelection(props: FormSelectionAttributes) {

    // const { defaultDataGet } = useContext(TableEngineContext)

    const { errored, useTable, defaultValue, ...restProps } = props
    const [data, setData] = useState<BackendTableComp[]>([])
    const ref = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        (async () => {
            if (!useTable) return;

            let res = await backend.get(useTable, {})
            // setData(Array.isArray(d.data.data) ? d.data.data : []))
            let d = res.data.data

            if (!d || !Array.isArray(d)) return;

            d = d.sort((a) => {
                if (a.id == defaultValue) return -1
                else return 1
            })
            setData(d)

            if (ref.current)
                ref.current.dispatchEvent(new Event("change", { bubbles: true }))
        })()
    }, [])

    return <select ref={ref} {...restProps}

        defaultValue={defaultValue}
        className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""}`}>
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