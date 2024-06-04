import { useContext, useEffect, useState } from "react"
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext"
import beautyNumber from "../../../constants/numberUtils"
import SkeletonContainer from "../../Layout/SkeletonContainer"

export default function SumOfTrans(props: { where: any ,update?:boolean}) {

    const { defaultDataGet } = useContext(TableEngineContext)
    const [totals, setTotals] = useState<{value:number,weight:number}>({value:-1,weight:-1})
    const mockWhere = { ...props.where }

    delete mockWhere.limit

    if (mockWhere.include)
        mockWhere.include = mockWhere.include.replace(/\w+/g, (r: string) => r + '[]')

    delete mockWhere.order

    mockWhere.attributes = "(sum)valor,(sum)peso,tipo"
    mockWhere.group = "tipo"

    useEffect(() => {
        defaultDataGet("transacao", mockWhere, (data: { valor: number,peso:number, tipo: boolean }[]) => {
            const totalValue: number = data.reduce((acum, next) => {
                if (next.tipo) return acum - next.valor
                else return acum + next.valor
            }, 0)

            const totalWeight: number = data.reduce((acum, next) => {
                if (!next.tipo) return acum + next.peso
                return acum
            }, 0)

            setTotals({value:totalValue,weight:totalWeight})
        })
    }, [props.where,props.update])

    if(totals.value <0 && totals.weight<0){
        return <SkeletonContainer className="inline-block w-28 h-3"/>
    }

    return `R$ ${beautyNumber(totals.value)} / ${totals.weight} KG`
}