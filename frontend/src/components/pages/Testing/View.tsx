import { ReactNode, useContext, useEffect, useState } from "react";
import Bar from "../../Bar";
import Content from "../../Content";
import SideBar from "../../SideBar";
import backend, { BackendTableComp, create } from "../../../constants/backend";
import ToolBar, { ToolBarButton } from "../../SubTopBar";
import CreationForm from "../Botes/BoteCreationForm";
import { globalPopupsContext } from "../../../App";
import OverPageInfo from "../../OverPageInfo";
import Table from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";

export default function View() {

    const { setGlobalPupupsByKey } = useContext(globalPopupsContext)
    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [selected, setSelected] = useState<number[]>([])

    useEffect(() => {
        (async () => {
            const d = await backend.get("botes", {})
            console.log(d)
            if (!d.data) return;
            setData(d.data)
        })()
    }, [update])

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
        selected.forEach(async (each, index) => {
            const response = await backend.remove("bote", each)
            if (response.error) {
                const popupID = 20 + index
                setGlobalPupupsByKey(popupID, <OverPageInfo onAccept={() => setGlobalPupupsByKey(popupID, null)}>
                    {response.message}
                </OverPageInfo>)
            }
        })
        setSelected([])
        setTimeout(() => {
            setUpdate(!update)
        }, 500)

    }

    return <>
        <Bar />
        <SideBar />
        <Content>
            <TableToolBar
                selected={selected}
                createHandler={createHandler}
                deleteHandler={deleteHandler}
                editHandler={() => null}
            />
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    selected={selected} onSelectChange={setSelected}
                    data={data}
                    disposition={[1, 6, 4, 4]}
                    tableItemHandler={(item) => [
                        item.id, item.nome, bDate(item.createdAt), bDate(item.updatedAt)
                    ]}
                    tableHeader={[
                        "ID", "Nome", "Data de Criação", "Ultima Atualização"
                    ]}
                    
                />
            </div>
        </Content>
    </>
}
