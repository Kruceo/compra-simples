import { priceComparation } from "./reportInternals/priceComparation";
import SideBar from "../../Layout/SideBar";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import { useState } from "react";
import Button from "../../Layout/Button";
import { TRANSACTION_CLOSED, TRANSACTION_OPEN } from "../../../constants/codes";
import FormSelection from "../../OverPageForm/FormSelection";

export default function BoatEntryComparationReport() {

    const nowDate = new Date()
    const defaultLastWeek = new Date(nowDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    defaultLastWeek.setHours(0)
    defaultLastWeek.setMinutes(0)
    defaultLastWeek.setSeconds(1)
    nowDate.setHours(23)
    nowDate.setMinutes(59)
    nowDate.setSeconds(59)

    const [date1, setDate1] = useState(defaultLastWeek)
    const [date2, setDate2] = useState(nowDate)
    const [status, setStatus] = useState(TRANSACTION_OPEN)
   

    return <>
        <Bar />
        <SideBar />
        <Content>

            {/* <p>{date1.toLocaleDateString() + ' ' + date1.toLocaleTimeString() + ' ### ' + date1.toISOString() + ' $$$ ' + date2input(date1)}</p> */}
            {/* <p>{date2.toLocaleDateString() + ' ' + date2.toLocaleTimeString() + ' ### ' + date2.toISOString() + ' $$$ ' + date2input(date2)}</p> */}

            <h2 className="p-4">Relatório - Comparativo de Preços</h2>
            <div className="p-4 flex justify-center items-center gap-4">
                <FormInput type="date"
                    defaultValue={date2input(defaultLastWeek)}
                    onChange={(e) => dateSetter(e.target.value, 24, 0, 1, setDate1)} />
                <p>Até</p>
                <FormInput type="date"
                    defaultValue={date2input(nowDate)}
                    onChange={(e) => dateSetter(e.target.value, 47, 59, 59, setDate2)} />
                <FormSelection
                    onChange={(e) => setStatus(parseInt(e.currentTarget.value))} >
                        <option value={TRANSACTION_OPEN}>Abertas</option>
                        <option value={TRANSACTION_CLOSED}>Fechadas</option>
                </FormSelection>
                <Button className="hover:bg-green-100 mx-2"
                    onClick={() => priceComparation(date1, date2,status)}>
                    <i>&#xe926;</i> Pronto
                </Button>
            </div>
        </Content>
    </>
}

export function date2input(date: Date) {
    const [y, m, d] = [
        date.getFullYear().toString().padStart(4, '0'),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0')
    ]
    return `${y}-${m}-${d}`
    // return date.toISOString()
}

export function dateSetter(strDate: string, hours: number, minutes: number, seconds: number, setter: Function) {
    const d = new Date(strDate)
    d.setHours(hours)
    d.setMinutes(minutes)
    d.setSeconds(seconds)
    setter(d)
}