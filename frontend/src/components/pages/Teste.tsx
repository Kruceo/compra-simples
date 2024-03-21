import axios from "axios";
import backend, { api_address, api_port, api_protocol, api_v } from "../../constants/backend/backend";
import FormPrevisionInput from "../OverPageForm/FormPrevisionInput";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { openPDF, writeTable } from "./Relatorios/reportInternals/libraryReports";
import Bar from "../Layout/Bar";
import SideBar from "../Layout/SideBar";
import FormSelection from "../OverPageForm/FormSelection";

export default function Teste() {
    const url = new URL(location.href)

    const table = url.searchParams.get("table")
    const include = url.searchParams.get("include")
    const attributes = url.searchParams.get("attributes")
    const order = url.searchParams.get("order")
    const groups = url.searchParams.get("groups")
    const [data, setData] = useState<any[]>([])
    useEffect(() => {
        (async () => {
            if (!table) return;
            let whereClause: any = {}

            if (include) whereClause["include"] = include
            if (attributes) whereClause["attributes"] = attributes
            if (order) whereClause["order"] = order
            if (groups) whereClause["group"] = groups
            const t = table as allTableNames
            const res = await backend.get(t, whereClause)

            setData(res.data.data ?? [])
        })()
    }, [])

    useEffect(() => {
        if (!data[0]) return;
        const pdf = new jsPDF()

        const headers = Object.keys(data[0])

        const table = data.map(each => Object.values(each) as string[])
        let fontsize = 50 / headers.length
        if (fontsize > 10) fontsize = 10
        pdf.setFontSize(fontsize)

        writeTable(pdf, table, 5, 5, headers)

        openPDF(pdf)
    }, [data])

    return <>
        <FormSelection useTable="bote" useTableWhere={{id:">5"}}></FormSelection>
    </>
}