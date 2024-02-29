import { useState } from 'react'
import Bar from '../../Layout/Bar'
import Button from '../../Layout/Button'
import Content from '../../Layout/Content'
import SideBar from '../../Layout/SideBar'
import FormInput from '../../OverPageForm/FormInput'
import { date2input, dateSetter } from './ViewPriceComparationReport'
import monthTransComparation from './monthTransComparation'

export default function MonthTransComparationReport() {

    const nowDate = new Date()
    const defaultLastWeek = new Date(nowDate.getTime() - (365 * 24 * 60 * 60 * 1000))
    defaultLastWeek.setHours(0)
    defaultLastWeek.setMinutes(0)
    defaultLastWeek.setSeconds(1)
    nowDate.setHours(23)
    nowDate.setMinutes(59)
    nowDate.setSeconds(59)

    const [date1, setDate1] = useState(defaultLastWeek)
    const [date2, setDate2] = useState(nowDate)

    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Relatório - Comparativo de Preços</h2>
            <div className="p-4 flex justify-center items-center">
                <FormInput type="date"
                    defaultValue={date2input(defaultLastWeek)}
                    onChange={(e) => dateSetter(e.target.value, 24, 0, 1, setDate1)} />
                <p className="mx-4">Até</p>
                <FormInput type="date"
                    defaultValue={date2input(nowDate)}
                    onChange={(e) => dateSetter(e.target.value, 47, 59, 59, setDate2)} />
                <Button className="hover:bg-green-100 mx-2"
                    onClick={() => monthTransComparation(date1, date2)}>
                    <i>&#xe926;</i> Pronto
                </Button>
            </div>
        </Content>
    </>
}