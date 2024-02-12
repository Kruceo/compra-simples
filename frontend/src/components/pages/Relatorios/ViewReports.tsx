import SideBar from "../../Layout/SideBar";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import { productEntryPriceComparation } from "./libraryReports";
import { ToolBarButton } from "../../Layout/SubTopBar";
import { useState } from "react";

export default function ViewReports() {

    const nowDate = new Date()
    const defaultLastWeek = new Date(nowDate.getTime() - (7 * 24 * 60 * 60 * 1000))

    const [date1, setDate1] = useState(defaultLastWeek)
    const [date2, setDate2] = useState(nowDate)

    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Relatório - Comparativo de Preços</h2>
            <div className="p-4 flex justify-center items-center">
                <FormInput type="date" defaultValue={date2input(defaultLastWeek)} onChange={(e) => setDate1(new Date(e.target.value))} />
                <p className="mx-4">Até</p>
                <FormInput type="date" defaultValue={date2input(nowDate)} onChange={(e) => setDate2(new Date(e.target.value))} />
                <ToolBarButton className="hover:bg-green-100 mx-2"
                    onClick={() => productEntryPriceComparation(date1, date2)}>
                    <i>&#xe926;</i> Pronto
                </ToolBarButton>
            </div>
        </Content>
    </>
}

function date2input(date: Date) {
    return date.toISOString().substring(0, 10)
}
