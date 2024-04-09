import React, { useContext, useEffect, useRef, useState } from "react"
import backend from "../../constants/backend/backend"
import { ErrorHandlerContext } from "../GlobalContexts/ErrorHandlerContext"
import { DefaultFormInput, defaultKeyUpHandler } from "./FormInput"

interface FormSelectionAttributes extends DefaultFormInput, React.HTMLAttributes<HTMLSelectElement> {
    useTable?: allTableNames,
    useTableWhere?: Object,
    errored?: boolean,
    name?: string
}

export default function FormSelection(props: FormSelectionAttributes) {

    const { pageErrorHandler } = useContext(ErrorHandlerContext)

    const { errored, useTable, defaultValue, next, useTableWhere, ...restProps } = props
    const [data, setData] = useState<{ nome: string, id: number }[]>([])
    const ref = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        (async () => {
            if (!useTable) return;
            let res = await backend.get(useTable, useTableWhere ?? {})

            if (res.data.error) {
                pageErrorHandler(res)
                return
            }

            let d = res.data.data

            if (!d || !Array.isArray(d)) return;

            d = d.sort((a) => {

                if (a.id == defaultValue)
                    return -10
                else return 10
            })
            setData(d)

        })()
        setTimeout(() => {
            if (ref.current)
                ref.current.dispatchEvent(new Event("change", { bubbles: true }))
        }, 100);

    }, [useTableWhere, defaultValue])
    return <select ref={ref} {...restProps}
        // defaultValue={defaultValue}
        className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""} ${props.className}`}>
        {
            props.children
        }
        {
            data.map((item) => <option className="bg-background"
                onKeyUp={(e) => defaultKeyUpHandler(e)}
                key={item.id}
                // selected={item.id.toString() == defaultValue}
                data-item={JSON.stringify(item)}
                value={item.id}>
                {item.nome}
            </option>)
        }
    </select>

}   