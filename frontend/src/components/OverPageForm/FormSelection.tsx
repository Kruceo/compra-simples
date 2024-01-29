import { useEffect, useState } from "react"
import backend, { BackendTableComp } from "../../constants/backend"
import { simpleSpawnInfo } from "../OverPageInfo"

interface FormSelectionAttributes extends React.HTMLAttributes<HTMLSelectElement> {
    useTable?: string,
    errored?: boolean,
    name?: string
}

export default function FormSelection(props: FormSelectionAttributes) {
    const { errored, useTable, defaultValue, ...restProps } = props
    const [data, setData] = useState<BackendTableComp[]>([])
    if (useTable) {
        useEffect(() => {
            (async () => {
                const d = await backend.get(useTable, {})

                if (d.error || !d.data) return alert("error in formSlection.tsx" + d.message)

                setData(d.data)

            })()
        })
    }

    return <select {...restProps} className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""}`}>
        {props.children}
        {
            data.map((each, index) => <option key={index} selected={each.id == defaultValue} value={each.id}>{each.nome}</option>)
        }
    </select>
}   