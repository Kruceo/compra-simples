import { useEffect, useRef, useState } from "react";
import TableItem from "./TableItem";
import { BackendTableComp } from "../../constants/backend";

export interface TableOrderEvent {
    // preventDefault: () => void,
    key: string,
    order: "ASC" | "DESC"

}

interface TableAttributes {
    data: BackendTableComp[],
    selected: number[],
    tableItemHandler: (item: BackendTableComp, index: number) => React.ReactNode[],
    disposition: number[],
    tableHeader: React.ReactNode[],
    onSelectChange?: (ids: number[]) => any,
    onOrderChange?: (event: TableOrderEvent) => any
}

export default function Table(props: TableAttributes) {
    let { data, disposition, tableHeader, tableItemHandler, onSelectChange, onOrderChange, selected } = props

    const togleSelectedHandler = (id: number) => {
        if (selected.includes(id)) {
            const newSelected = selected.filter(each => { if (each != id) return each })
            //On select change handler spawn
            onSelectChange ? onSelectChange(newSelected) : null
            //Set local selected
        }
        else {
            //On select change handler spawn
            onSelectChange ? onSelectChange([...selected, id]) : null
            //Set local selected
        }

    }
    if (data.length == 0) {
        return "No data"
    }

    const itemKeys = Object.keys(data[0])

    const orderHandler = onOrderChange ? onOrderChange : () => null

    return <div>
        <TableItem
            headerMode={true}
            disposition={disposition}>
            {tableHeader.map((each, index) => {
                return <div className="flex group">
                    {each}
                    <OrderButton
                        onClick={(order) => orderHandler({ key: itemKeys[index], order })} />
                </div>
            })}
        </TableItem>
        {
            data.map((item, index) => {
                const itemId = parseInt("" + item.id)
                return <TableItem
                    disposition={disposition}
                    key={index}
                    selected={selected.includes(itemId)}
                    onClick={() => {
                        if (item.id) togleSelectedHandler(itemId)
                    }}>
                    {tableItemHandler(item, index)}
                </TableItem>
            })
        }
    </div>
}

interface OrderButtonAttributes {
    onClick: (value: "ASC" | "DESC") => any
}

function OrderButton(props: OrderButtonAttributes) {

    const [currentOrder, setCurrentOrder] = useState(false)

    return <button onClick={(e) => {
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
