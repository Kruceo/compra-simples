import { useState } from "react"
import Button from "../Layout/Button"
import jsPDF from "jspdf"
import { openPDF, writeHeader, writeTable } from "./Relatorios/reportInternals/libraryReports"
import { getSigles } from "../../constants/stringUtils"

export default function Teste() {
    const [body, setBody] = useState("")
    const [add, setAdd] = useState(window.localStorage.getItem("_vasAdd") ?? "http://localhost:8080/v1/produto")
    const [m, setM] = useState("GET")
    const [resText, setResText] = useState("")

    function pdftest() {
        const pdf = new jsPDF()

        const obj = JSON.parse(resText) as { data: any[] }

        const table: string[][] = (obj.data.map(each => Object.values(each).map(each => "" + each)))
        const header = Object.keys(obj.data[0]).map(each=>getSigles(each.replace("_"," "))) as string[]
        
        const disposition = [header,...table].reduce((acum, next) => {
            next.forEach((value, index) => {
                const str = ("" + value)
                console.log(str, str.length, acum[index])
                if (str.length > acum[index]) {
                    acum[index] = str.length
                }
            })
            return acum
        }, table[0].map(()=>0))

        
        let lastbox = writeHeader(pdf,"",new Date(),new Date())
        pdf.setFontSize(12)
        writeTable(pdf, table, lastbox.x, lastbox.y2+6, header,disposition)

        openPDF(pdf)


    }

    return <>
        <div>
            <main>
                <select name="mode" id="" onChange={(e) => setM(e.currentTarget.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                </select>
            </main>
            <main>
                <textarea className="w-full h-64" defaultValue={add} onChange={(e) => {
                    window.localStorage.setItem("_vasAdd", e.currentTarget.value)
                    setAdd(e.currentTarget.value.replace(/\n/g, ""))
                }} />
            </main>

            <textarea className="w-full h-64" onChange={(e) => {
                setBody(e.currentTarget.value)
            }} />
            <Button className="mx-4" onClick={async () => {
                let b = m == "GET" ? undefined : body
                const res = await fetch(add, {
                    body: b,
                    method: m,
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    mode: "cors"
                })

                setResText(JSON.stringify(await res.json(), null, 2))
            }}>
                SEND
            </Button>


            <Button onClick={pdftest}>
                PDF
            </Button>
            <pre>
                <code>
                    {resText}
                </code>
            </pre>
        </div>
    </>
}