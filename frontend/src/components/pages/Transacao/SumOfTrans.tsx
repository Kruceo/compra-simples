import { useContext, useEffect, useState } from "react"
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext"
import beautyNumber from "../../../constants/numberUtils"

export default function SumOfTrans(props: { where: any ,update?:boolean}) {

    const { defaultDataGet } = useContext(TableEngineContext)
    const [values, setValues] = useState<number>(-1)
    let mockWhere = { ...props.where }

    delete mockWhere.limit

    if (mockWhere.include)
        mockWhere.include = mockWhere.include.replace(/\w+/g, (r: string) => r + '[]')

    delete mockWhere.order

    mockWhere.attributes = "(sum)valor,tipo"
    mockWhere.group = "tipo"

    useEffect(() => {
        defaultDataGet("transacao", mockWhere, (data: { valor: number, tipo: boolean }[]) => {
            let total: number = data.reduce((acum, next) => {
                if (next.tipo) return acum - next.valor
                else return acum + next.valor
            }, 0)
            setValues(total)
        })
    }, [props.where,props.update])

    return beautyNumber(values)
}