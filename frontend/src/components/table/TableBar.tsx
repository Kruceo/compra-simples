import React from "react"

interface TableBarAttributes {
    headerMode?: boolean,
    className?: string,
    children: React.ReactNode | React.ReactNode[],
    disposition?: number[],
    onClick?: React.MouseEventHandler
}

export function TableBar(props: TableBarAttributes) {
    const headerMode = props.headerMode

    const children = Array.isArray(props.children) ? props.children : [props.children]

    let disposition = Array.from({ length: children.length }, () => 1)
    if (props.disposition) props.disposition.forEach((each, index) =>
        disposition[index] = each
    )

    const gridTemplateColumns = disposition.reduce((acum, next) => acum + ` ${next}fr`, "")

    return <div
        style={{ gridTemplateColumns: gridTemplateColumns }}
        className={`grid p-4 transition-colors ${(!headerMode ? "hover:bg-hovers " : "")} ${props.className}`}
        onClick={props.onClick}
    >
        {
            children.map((child, index) => {
                return <div
                    key={index}
                    className={`${index == 0 ? "border-none" : "border-borders"} col-span-1 border-l pl-2 `}>
                    {child}
                </div>
            })
        }
    </div>
}