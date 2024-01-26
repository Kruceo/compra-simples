import React from "react"

interface TableBarAttributes {
    headerMode?: boolean,
    className?: string,
    children: React.ReactNode | React.ReactNode[],
    disposition?: number[],
    selected?:boolean,
    onClick?: React.MouseEventHandler
}

export default function TableItem(props: TableBarAttributes) {
    const headerMode = props.headerMode

    const children = Array.isArray(props.children) ? props.children : [props.children]

    let disposition = Array.from({ length: children.length }, () => 1)
    if (props.disposition) props.disposition.forEach((each, index) =>
        disposition[index] = each
    )

    const gridTemplateColumns = disposition.reduce((acum, next) => acum + ` ${next}fr`, "")

    return <div
        style={{ gridTemplateColumns: gridTemplateColumns }}
        className={`relative grid p-4 transition-colors ${(!headerMode ? "" : "border-b border-borders font-bold shadow-lg")} ${props.selected == true?"bg-blue-300":"hover:bg-hovers"} ${props.className}`}
        onClick={props.onClick}
    >
        {
            children.map((child, index) => {
                return <div
                    key={index}
                    className={`${index == 0 ? "border-none" : "border-borders"} col-span-1 border-l pl-2`}>
                    {child}
                </div>
            })
        }
    </div>
}