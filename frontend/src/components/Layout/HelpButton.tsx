import { useContext } from "react"
import { GlobalPopupsContext } from "../GlobalContexts/PopupContext"

export default function HelpButton(props: { content: string, className?: string }) {
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    return <div title="Ajuda" className={`p-2 ${props.className??""}`}>
        <button onClick={() => simpleSpawnInfo(props.content)} className="rounded-full bg-green-300 font-bold w-7 h-7 text-sm flex justify-center items-center cursor-pointer">
            <i>?</i>
        </button>
    </div>
}