import { useContext, useState } from "react";
import TableItem from "./TableItem";
import TableContextMenu, { ContextMenuButton } from "./TableContextMenu";
import { GlobalPopupsContext } from "../GlobalContexts/PopupContext";
import { data } from "autoprefixer";

export interface TableOrderEvent {
    key: string | string[],
    order: "ASC" | "DESC"
}

interface TableAttributes {
    data: allTableTypes[],
    tableItemHandler: (item: any, index: number) => React.ReactNode[],
    tableOrderKeys?: (string | string[])[],
    disposition: number[],
    tableHeader: React.ReactNode[],
    onOrderChange?: (event: TableOrderEvent) => any,
    contextMenu?: { buttons: { element: React.ReactNode, handler: (id: number) => any }[] }
    enableContextMenu?: boolean,

    selected?: number[],
    selectedSetter?: (d: number[]) => any
}

export default function Table(props: TableAttributes) {
    let { data, disposition, tableHeader, tableItemHandler, tableOrderKeys, onOrderChange, enableContextMenu } = props

    //Usado para o menu de contexto
    const { setGlobalPopupByKey } = useContext(GlobalPopupsContext)

    const orderHandler = onOrderChange ? onOrderChange : () => null

    const removeContextMenu = () => setGlobalPopupByKey("ContextMenu", null)

    const spawnContextMenu = (itemID: number, x: number, y: number) => {
        if (!props.contextMenu) return;
        if (enableContextMenu == undefined || enableContextMenu)
            setGlobalPopupByKey("ContextMenu",
                <TableContextMenu x={x} y={y}>
                    {
                        props.contextMenu.buttons.map(each => {
                            return <ContextMenuButton key={Math.random() + itemID} onClick={() => {
                                each.handler(itemID);
                                removeContextMenu()
                            }}>
                                {each.element}
                            </ContextMenuButton>
                        })
                    }
                </TableContextMenu>
            )
    }

    return <div>
        <TableItem
            headerMode={true}
            disposition={disposition}>
            {
                tableHeader.map((each, index) => {
                    return <div key={index} className="flex group">
                        {each}
                        {
                            (tableOrderKeys && tableOrderKeys[index]) ?
                                <OrderButton onClick={(order) => { if (tableOrderKeys) orderHandler({ key: tableOrderKeys[index], order }) }} />
                                : null
                        }
                    </div>
                })}
        </TableItem>
        {data.length === 0 ? <p className="p-4 w-full text-center">Nenhum item</p> : null}
        {
            data.map((item, index) => {

                const itemID = item.id
                return <TableItem
                    selected={props.selected?.includes(itemID)}
                    //Acionar o menu de contexto
                    onContextMenu={(e) => {
                        if (!props.contextMenu) return;
                        e.preventDefault();
                        spawnContextMenu(itemID, e.clientX, e.clientY)
                    }}
                    onClick={() => {
                        removeContextMenu();
                        if (!props.selected || !props.selectedSetter) return;

                        if (!props.selected.includes(itemID) && props.selectedSetter)
                            props.selectedSetter([...props.selected, itemID])

                        else props.selectedSetter(props.selected.filter(each => each != itemID))
                    }
                    }
                    disposition={disposition}
                    key={index}
                // className={index/2 != Math.round(index/2)?"bg-[#00000019]":""}
                >
                    {
                        tableItemHandler(item, index).map((attr, attrIndex) => <div className={enableContextMenu == false ? "" : "cursor-context-menu"} key={attrIndex}>
                            {attr}
                        </div>)
                    }
                </TableItem>
            })
        }
    </div >
}

interface OrderButtonAttributes {
    onClick: (value: "ASC" | "DESC") => any
}

function OrderButton(props: OrderButtonAttributes) {

    const [currentOrder, setCurrentOrder] = useState(false)

    return <button onClick={() => {
        props.onClick(currentOrder ? "ASC" : "DESC")
        setCurrentOrder(!currentOrder)
    }
    } className="ml-auto mr-2 opacity-0 group-hover:opacity-100">
        {
            currentOrder ?
                <i>&#xea3e;</i> :
                <i>&#xea3a;</i>
        }
    </button>
}
