import jsPDF from "jspdf"
import { useContext, useEffect } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import { globalPopupsContext } from "../../../App";
import SideBar from "../../Layout/SideBar";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import { productEntryPriceComparation } from "../Entrada/internal";

export default function ViewReports() {

    // const { simpleSpawnInfo } = useContext(globalPopupsContext)

    const nowDate = new Date()
    const defaultLastWeek = new Date(nowDate.getTime() - (7 * 24 * 60 * 60 * 1000))

    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Relatório - Comparativo de Preços</h2>
            <div className="p-4 flex justify-center items-center">
                <FormInput type="date" defaultValue={date2input(defaultLastWeek)} />
                <p className="mx-4">Até</p>
                <FormInput type="date" defaultValue={date2input(nowDate)} />
                <button className="py-2 px-4 mx-4 rounded-sm hover:bg-green-100"
                    onClick={() => productEntryPriceComparation(defaultLastWeek, nowDate)}>
                    <i>&#xe926;</i> Pronto
                </button>
            </div>
        </Content>
    </>
}

function date2input(date: Date) {
    return date.toISOString().substring(0, 10)
}
