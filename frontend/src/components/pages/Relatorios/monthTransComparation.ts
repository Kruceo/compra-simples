import jsPDF from "jspdf";
import { openPDF, writeHeader, writeTable } from "./libraryReports";
import { useEffect } from "react";
import backend from "../../../constants/backend";
export default async function monthTransComparation(date1:Date,date2:Date){
    const pdf = new jsPDF()

    const res = await backend.get('transacao',{
        attributes:"(max)createdAt,(month)createdAt,(year)createdAt,(sum)peso,(sum)valor",
        group:"createdAt_month,createdAt_year",
        order:"createdAt,ASC",
        status:0,
        createdAt:">"+date1.toISOString()+',<'+date2.toISOString(),
        tipo:0
    })

    if(res.data.error || !res.data.data || !Array.isArray(res.data.data))return alert('error 001');

    const table = res.data.data.map((each:any)=>{
        const {createdAt_month,createdAt_year,createdAt,...rest} = each
        const junction = `${createdAt_month}/${createdAt_year}`.padStart(7,'0')
        return [junction,...Object.values(rest)]
    }) as string[][]

    console.log(table)

    let lastBoundingBox = writeHeader(pdf,new Date().toLocaleDateString().slice(0,5),date1,date2)
    pdf.setFontSize(12)
    writeTable(pdf,table,lastBoundingBox.x,lastBoundingBox.y2+7,["Mês/Ano","Peso","Valor"],[1,3,3])

    openPDF(pdf)
}
