import { PropsWithChildren } from "react"

export default function ToolBar(props: PropsWithChildren) {
    return <div className="border-b bg-toolbar border-borders h-12 box-border flex p-1 w-[calc(100%-11rem)] fixed top-14">
        <div className="mr-auto flex gap-2">
            <ToolBarButton title="Barra de Ferramentas">
                <i className="text-slate-400">&#xe996;</i>
            </ToolBarButton>
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
    const enabled = props.enabled ?? true
    const cpProps = { ...props }
    delete cpProps.enabled
    return <button {...cpProps}
        onClick={enabled ? props.onClick : undefined}
        className={props.className + " text-base font-bold flex gap-2 px-4 py-2 rounded-sm " + (enabled == true ? "" : "opacity-30")}>
        {props.children}
    </button>
}