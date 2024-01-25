import { useEffect, useState } from "react";
import Bar from "../Bar";
import Content from "../Content";
import SideBar from "../SideBar";
import axios from "axios";
import backend, { BackendTableComp } from "../../constants/backend";
import { BackendResponse } from "../../constants/backend";
import { bDate } from "../../constants/dateUtils";
import { TableBar } from "../table/TableBar";
import ToolBar from "../table/ToolBar";

export default function ViewBotes() {

    const [data, setData]: [BackendTableComp[], React.Dispatch<React.SetStateAction<BackendTableComp[]>>] =
        useState<BackendTableComp[]>([]);

    const [selected, setSelected] = useState([-1])
    useEffect(() => {
        (async () => {
            const d = await backend.get("botes", {})
            if (!d.data) return;
            setData(d.data)
        })()
    }, [])

    return <>
        <Bar />
        <SideBar />
        <Content>
            <ToolBar></ToolBar>
            <div className="w-full h-full mt-[6.5rem]">
                <TableBar className="border-b border-borders font-bold shadow-lg"
                    headerMode={true}
                    disposition={[1, 5, 3, 3]}>
                    <p>ID</p>
                    <p>Nome</p>
                    <p>Data de Criação</p>
                    <p>Ultima Modificação</p>
                </TableBar>
                {
                    data.map((bote, index) => <TableBar disposition={[1, 5, 3, 3]} key={Math.random() + index}>
                        <p>{bote.id}</p>
                        <p>{bote.nome}</p>
                        <p>{bDate(bote.createdAt)}</p>
                        <p>{bDate(bote.updatedAt)}</p>
                    </TableBar>)
                }
            </div>

        </Content>
    </>
}

function BoteBar(props: { headerMode?: boolean, bote: BackendTableComp, className?: string, key?: number }) {
    const bote = props.bote
    const headerMode = props.headerMode

    const onClickHandler = () => {

    }

    return <div className={"grid grid-cols-12 p-4 transition-colors " + (!headerMode ? "hover:bg-hovers " : "") + props.className} key={props.key}>
        <div>{bote.id}</div>
        <div className="col-span-4 border-l pl-2 border-borders">{bote.nome}</div>
        <div className="col-span-3 border-l pl-2 border-borders">{headerMode ? bote.updatedAt : bDate(bote.updatedAt)}</div>
        <div className="col-span-3 border-l pl-2 border-borders">{headerMode ? bote.createdAt : bDate(bote.createdAt)}</div>
    </div>
}

