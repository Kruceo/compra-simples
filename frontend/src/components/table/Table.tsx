import { useEffect, useRef, useState } from "react";
import TableItem from "./TableItem";
import { BackendTableComp } from "../../constants/backend";

interface TableAttributes {
    data: BackendTableComp[],
    selected: number[],
    tableItemHandler: (item: BackendTableComp, index: number) => React.ReactNode[],
    disposition: number[],
    tableHeader: React.ReactNode[],
    onSelectChange?: (ids: number[]) => any
}

export default function Table(props: TableAttributes) {
    const { data, disposition, tableHeader, tableItemHandler, onSelectChange, selected } = props

    const togleSelectedHandler = (id: number) => {
        if (selected.includes(id)) {
            const newSelected = selected.filter(each => { if (each != id) return each })
            //On select change handler spawn
            onSelectChange ? onSelectChange(newSelected) : null
            //Set local selected
            // setSelected(newSelected)
        }
        else {
            //On select change handler spawn
            onSelectChange ? onSelectChange([...selected, id]) : null
            //Set local selected
            // setSelected([...selected, id])
        }

    }

    return <div>
        <TableItem
            headerMode={true}
            disposition={disposition}>
            {tableHeader}
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
