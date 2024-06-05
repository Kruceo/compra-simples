import React from "react"

interface TableBarAttributes {
    headerMode?: boolean,
    className?: string,
    children: React.ReactNode | React.ReactNode[],
    disposition?: number[],
    selected?: boolean,
    onContextMenu?: React.MouseEventHandler<HTMLDivElement>
    onClick?: React.MouseEventHandler
}

export default function TableItem(props: TableBarAttributes) {
    const headerMode = props.headerMode

    const children = Array.isArray(props.children) ? props.children : [props.children]

    const disposition = Array.from({ length: children.length }, () => 1)
    if (props.disposition) props.disposition.forEach((each, index) =>
        disposition[index] = each
    )

    const gridTemplateColumns = disposition.reduce((acum, next) => acum + ` ${next}fr`, "")

    return <div
        id="table-item"
        onContextMenu={props.onContextMenu}
        style={{ gridTemplateColumns: gridTemplateColumns }}
        className={`${headerMode?"bg-headers font-bold":"hover:bg-hovers"} relative grid items-center p-4 transition-colors ${props.selected ? "bg-selected hover:bg-selected" : ""} ${props.className}`}
        onClick={props.onClick}
    >
        {
            children.map((child, index) => {
                return <div
                    key={index}
                    className={`${index == 0 ? "border-none" : "border-borders"} border-l col-span-1 px-3`}>
                    {child}
                </div>
            })
        }
    </div>
}