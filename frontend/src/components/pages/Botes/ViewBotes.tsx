import { ReactNode, useContext, useEffect, useState } from "react";
import Bar from "../../Bar";
import Content from "../../Content";
import SideBar from "../../SideBar";
import backend, { BackendTableComp, create } from "../../../constants/backend";
import { bDate } from "../../../constants/dateUtils";
import { TableBar } from "../../table/TableBar";
import ToolBar, { ToolBarButton } from "../../table/ToolBar";
import CreationForm from "./BoteCreationForm";
import { globalPopupsContext } from "../../../App";

export default function ViewBotes() {

    const [data, setData]: [BackendTableComp[], React.Dispatch<React.SetStateAction<BackendTableComp[]>>] =
        useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [selected, setSelected] = useState<number[]>([])

    const togleSelected = (id: number) => {
        if (selected.includes(id))
            setSelected(selected.filter(each => { if (each != id) return each }))
        else setSelected([...selected, id])
    }

    useEffect(() => {
        (async () => {
            const d = await backend.get("botes", {})
            console.log(d)
            if (!d.data) return;
            setData(d.data)
        })()
    }, [update])

    const { setGlobalPupupsByKey } = useContext(globalPopupsContext)

    const createHandler = () => {
        setGlobalPupupsByKey(0,
            <CreationForm
                mode="creation"
                onCancel={() => setGlobalPupupsByKey(0, null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    const deleteHandler = () => {
        selected.forEach(async each => console.log(await backend.remove("bote", each)))
    }

    return <>
        <Bar />
        <SideBar />
        <Content>
            <ToolBar>
                {/* <ToolBarButton className="hover:bg-yellow-100"><i>&#xe954;</i> Imprimir</ToolBarButton> */}
                <ToolBarButton title="Clique para criar" className="hover:bg-green-100" onClick={createHandler}>
                    <i>&#xea3b;</i> Criar
                </ToolBarButton>
                <ToolBarButton title="Selecione para editar" className="hover:bg-blue-100" enabled={selected.length > 0 && selected.length < 2}>
                    <i>&#xe905;</i> Editar
                </ToolBarButton>
                <ToolBarButton title="Selecione para excluir" className="hover:bg-red-100" onClick={deleteHandler} enabled={selected.length > 0}>
                    <i>&#xe9ac;</i> Excluir
                </ToolBarButton>
            </ToolBar>
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
                    data.map((bote, index) => <TableBar
                        disposition={[1, 5, 3, 3]}
                        key={index}
                        // Adds this table item to 'selected' array
                        className={selected.includes(parseInt("" + bote.id)) ? "bg-blue-100" : ""}
                        onClick={() => {
                            if (bote.id) togleSelected(parseInt("" + bote.id))
                        }}
                    >
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
