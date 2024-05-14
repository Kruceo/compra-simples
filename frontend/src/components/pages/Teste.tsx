import { useState } from "react"

export default function Teste() {
    const [body, setBody] = useState("")
    const [add, setAdd] = useState(window.localStorage.getItem("_vasAdd")??"http://localhost:8080/v1/produto")
    const [m, setM] = useState("GET")
    const [resText, setResText] = useState("")
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
                    setAdd(e.currentTarget.value.replace(/\n/g,""))
                }} />
            </main>

            <textarea onChange={(e) => {
                setBody(e.currentTarget.value)
            }} />
            <button onClick={async () => {
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
            </button>

            <pre>
                <code>
                    {resText}
                </code>
            </pre>
        </div>
    </>
}