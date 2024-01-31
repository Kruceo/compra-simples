import { useEffect, useRef, useState } from "react"
import backend, { BackendTableComp } from "../../constants/backend"
import { simpleSpawnInfo } from "../Layout/OverPageInfo"

interface FormSelectionAttributes extends React.HTMLAttributes<HTMLSelectElement> {
    useTable?: string,
    errored?: boolean,
    name?: string
}

export default function FormSelection(props: FormSelectionAttributes) {
    const { errored, useTable, defaultValue, ...restProps } = props
    const [data, setData] = useState<BackendTableComp[]>([])
    const ref = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        if (useTable) {
            (async () => {
                const d = await backend.get(useTable, {})

                if (d.error || !d.data) return alert("error in formSlection.tsx " + d.message)

                setData(d.data.sort((a) => {
                    if (a.id == defaultValue) return -1
                    else return 1
                }))
                if (ref.current) {
                    ref.current.dispatchEvent(new Event("change", { bubbles: true }))
                }
               
            })()
        }
    }, [])

    return <select ref={ref} {...restProps}

        defaultValue={defaultValue}
        className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""}`}>
        {
            props.children
        }
        {
            data.map((item) => <option
                key={item.id}
                // selected={item.id == defaultValue}
                data-item={JSON.stringify(item)}
                value={item.id}>
                {item.nome}
            </option>)
        }
    </select>
}   