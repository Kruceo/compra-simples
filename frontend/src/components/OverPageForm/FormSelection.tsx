import React, { useContext, useEffect, useRef, useState } from "react"
import backend from "../../constants/backend/backend"
import { ErrorHandlerContext } from "../GlobalContexts/ErrorHandlerContext"
import { DefaultFormInput, defaultKeyUpHandler } from "./FormInput"
import SkeletonContainer from "../Layout/SkeletonContainer"

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
    const [loadingData, setLoadingData] = useState(false)

    const ref = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        (async () => {
            if (!useTable) return;

            setLoadingData(true)

            const res = await backend.get(useTable, useTableWhere ?? {})

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
            setLoadingData(false)
        })()
        setTimeout(() => {
            if (ref.current)
                ref.current.dispatchEvent(new Event("change", { bubbles: true }))
        }, 100);

    }, [useTableWhere, defaultValue])

    // if(loadingData)return <SkeletonContainer className="w-36 h-11"/>

    return <>
        {
            loadingData ? <SkeletonContainer className={props.className + " h-11 w-full"} /> : null
        }
        <select ref={ref} {...restProps}
            // defaultValue={defaultValue}
            className={`bg-transparent px-3 py-2 border-borders border-input-default rounded-input-default ${errored ? "border-red-600" : ""} ${props.className} focus:outline-offset-1 focus:outline-1 focus:outline-default-text ${loadingData ? "!h-0 !w-0 !appearance-none !p-0 !border-none absolute" : ""}`}>
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
    </>

}   