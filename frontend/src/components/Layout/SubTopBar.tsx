interface ToolBarAttributes {
    children?: React.ReactNode,
    leftContent?: React.ReactNode
}

export default function SubTopBar(props: ToolBarAttributes) {
    return <div className="border-b-default bg-toolbar border-borders h-12 box-border flex p-1 w-[calc(100%-3rem)] fixed top-14 z-20">
        <div className="mr-auto flex gap-2 items-center">
            {/* <ToolBarButton title="Barra de Ferramentas">
                <i className="text-slate-400">&#xe996;</i>
            </ToolBarButton> */}
            {props.leftContent}
        </div>
        <div className="ml-auto mr-4 flex gap-2">
            {props.children}
        </div>
    </div>


}

interface ToolBarButtonAttributes extends React.HTMLAttributes<HTMLButtonElement> {
    enabled?: boolean
}

export function ToolBarButton(props: ToolBarButtonAttributes) {
    const { enabled, ...restProps } = props
    const e = (enabled == undefined) ? true : enabled
    return <button {...restProps}
        onClick={e ? props.onClick : undefined}
        className={props.className + " text-base font-bold flex items-center gap-2 px-4 py-2 rounded-sm hover:bg-hovers " + (e ? "" : "opacity-30")}>
        {props.children}
    </button>
}