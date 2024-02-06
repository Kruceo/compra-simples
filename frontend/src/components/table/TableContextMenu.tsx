export default function TableContextMenu(props: { x: number, y: number, children: React.ReactNode }) {

    let { x, y } = props
    let transformY = "0%"
    let transformX = "0%"
    if (y > window.screen.height - 240)
        transformY = "-100%"
    if (x > window.screen.width - 240)
        transformX = "-100%"

    return <div className="bg-subpanel shadow-lg border-borders border min-w-40 flex flex-col fixed z-50" style={{ left: x, top: y, transform: `translate(${transformX},${transformY})` }}>
        {props.children}
    </div>
}

export function ContextMenuButton(props: React.HTMLAttributes<HTMLButtonElement>) {
    return <button className="p-4 gap-2 hover:bg-[#0001] flex justify-start" {...props}>{props.children}</button>
}