import { useEffect, useState } from "react"
import Button from "../Layout/Button"
import jsPDF from "jspdf"
import { openPDF, writeHeader, writeTable } from "./Reports/reportInternals/libraryReports"
import { getSigles } from "../../constants/stringUtils"
import SideBar from "../Layout/SideBar"
import Bar from "../Layout/Bar"
import Content from "../Layout/Content"
import thermalPrinter from "../../constants/thermalPrinter"
import FormInput from "../OverPageForm/FormInput"

export default function Teste() {
    const [body, setBody] = useState("")
    const [add, setAdd] = useState(window.localStorage.getItem("test-url") ?? "http://localhost:8080/v1/produto")
    const [m, setM] = useState("GET")
    const [resText, setResText] = useState("")

    function pdftest() {
        const pdf = new jsPDF()

        const obj = JSON.parse(resText) as { data: any[] }

        const table: string[][] = (obj.data.map(each => Object.values(each).map(each => "" + each)))
        const header = Object.keys(obj.data[0]).map(each => getSigles(each.replace("_", " "))) as string[]

        const disposition = [header, ...table].reduce((acum, next) => {
            next.forEach((value, index) => {
                const str = ("" + value)
                if (str.length > acum[index]) {
                    acum[index] = str.length
                }
            })
            return acum
        }, table[0].map(() => 0))


        const lastbox = writeHeader(pdf, "", new Date(), new Date())
        pdf.setFontSize(12)
        writeTable(pdf, table, lastbox.x, lastbox.y2 + 5, header, disposition)

        openPDF(pdf)


    }

    return <>
        <Bar />
        <SideBar />
        <Content className="p-4">
            <main className="flex my-4">
                <h3>Metodo:</h3>
                <select className="bg-background border-borders border-input-default"
                    name="mode" id="" onChange={(e) => setM(e.currentTarget.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="OPTIONS">OPTIONS</option>
                </select>
            </main>
            <main className="my-4">
                <div className="flex">
                    <h3>URL</h3>
                    <button className="ml-auto mr-4" onClick={() => {
                        const el: HTMLInputElement | null = document.querySelector("#url")
                        if (!el) return

                        el.value = el.value.replace(/\n/g, "")
                    }}>minify</button>
                    <button onClick={() => {
                        const el: HTMLInputElement | null = document.querySelector("#url")
                        if (!el) return

                        el.value = el.value.replace(/&|\?/g, (r: string) => r + "\n")
                    }}>maxify</button>
                </div>
                <textarea id="url" className="w-full h-32 p-2 rounded-md text-default-text bg-background border-input-default border-borders" defaultValue={add} onChange={(e) => {
                    window.localStorage.setItem("test-url", e.currentTarget.value)
                    setAdd(e.currentTarget.value.replace(/\n/g, ""))
                }} />
            </main>
            {
                m != "GET" ?
                    <main className="my-4">
                        <h3>Body</h3>
                        <textarea className="w-full h-32 p-2 rounded-md text-default-text bg-background border-input-default border-borders" onChange={(e) => {
                            setBody(e.currentTarget.value)
                        }} />
                    </main>
                    : null
            }
            <Button className="mx-4" onClick={async () => {
                const b = m == "GET" ? undefined : body
                const res = await fetch(add, {
                    body: b,
                    method: m,
                    credentials: "include",
                    headers: { "Content-Type": "application/json", Authorization: `bearer ${window.localStorage.getItem("auth-token")}` },
                    mode: "cors"
                })

                setResText(JSON.stringify(await res.json(), null, 2))
            }}>Enviar</Button>

            <Button onClick={pdftest}>Gerar PDF</Button>
            <main className="my-4 py-4 border-t-borders border-t">
                <h3>Resultado (JSON)</h3>
                <pre className="border-borders border rounded-md min-h-64">
                    <code>
                        {resText}
                    </code>
                </pre>
            </main>

            <main>
                <TestPrinterSect />
            </main>
        </Content>
    </>
}

function TestPrinterSect() {
    const [pWidth, setPWidth] = useState(-1)
    const [pInput, setPInput] = useState("Testando")
    const [err, setErr] = useState("No error")
    useEffect(() => {
        thermalPrinter.getWidth()
            .then((data: { data: { width: number } }) => {
                setPWidth(data.data.width)
            }).catch(err => {
                setErr(err.message)
            })
    })
    return <>
        <h3>Testar Impressora</h3>
        <p>Width: {pWidth} chars</p>
        <FormInput onChange={(e)=>setPInput(e.currentTarget.value)}/>
        <Button onClick={() => {
            thermalPrinter.print([["println", pInput], ['cut']]).catch(err => {
                setErr(err.message)
            })
        }}>Test print</Button>
        <p className="text-red-500">{err}</p>
    </>
}