import { useState } from "react";
import { TRANSACTION_CLOSED, TRANSACTION_OPEN } from "../../../constants/codes";
import Bar from "../../Layout/Bar";
import Button from "../../Layout/Button";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import FormInput from "../../OverPageForm/FormInput";
import FormSelection from "../../OverPageForm/FormSelection";
import { date2input, dateSetter } from "./ViewPriceComparationReport";
import entryItemReport from "./reportInternals/entryItemReport";

export default function ViewEntryItemReport() {

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
            <h2 className="p-4">Relatório - Itens da Transação</h2>
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
                    onClick={() => entryItemReport(date1, date2, status)}>
                    <i>&#xe926;</i> Pronto
                </Button>
            </div>
        </Content>
    </>
}