export default function ToolBar() {
    return <div className="border-b bg-toolbar border-borders h-12 box-border flex p-1 w-[calc(100%-11rem)] fixed top-14">
        <div className="mr-auto flex gap-2">
            <ToolBarButton title="Barra de Ferramentas">
                <i className="text-slate-400">&#xe996;</i>
            </ToolBarButton>
        </div>
        <div className="ml-auto mr-4 flex gap-2">
            <ToolBarButton className="hover:bg-green-300">
                <i>&#xea3b;</i> Criar
            </ToolBarButton>
            <ToolBarButton className="hover:bg-red-300">
                <i>&#xe9ac;</i> Excluir
            </ToolBarButton>
        </div>
    </div>


}



export function ToolBarButton(props: React.HTMLAttributes<HTMLButtonElement>) {
    return <button {...props} className={props.className + " text-base font-bold flex gap-2 px-4 py-2 rounded-md"}>
        {props.children}
    </button>
}