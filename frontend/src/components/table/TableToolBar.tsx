import SubTopBar, { ToolBarButton } from "../SubTopBar";

interface TableToolBarAttributes {
    selected: number[],
    createHandler: React.MouseEventHandler<HTMLButtonElement>,
    editHandler: React.MouseEventHandler<HTMLButtonElement>,
    deleteHandler: React.MouseEventHandler<HTMLButtonElement>
}

export default function TableToolBar(props: TableToolBarAttributes) {
    const { selected, createHandler, deleteHandler } = props

    return <SubTopBar leftContent={selected.length > 0 ? selected.length + ' itens selecionados' : ''}>
        {/* <ToolBarButton className="hover:bg-yellow-100"><i>&#xe954;</i> Imprimir</ToolBarButton> */}
        <ToolBarButton title="Clique para criar" className="hover:bg-green-100" onClick={createHandler}>
            <i>&#xea3b;</i> Criar
        </ToolBarButton>
        <ToolBarButton title="Selecione para editar" className="hover:bg-blue-100" enabled={selected.length > 0 && selected.length < 2}>
            <i>&#xe905;</i> Editar
        </ToolBarButton>
        <ToolBarButton title="Selecione para excluir" className="hover:bg-red-100" onClick={deleteHandler} enabled={selected.length > 0}>
            <i>&#xe9ac;</i> Excluir
        </ToolBarButton>
    </SubTopBar>
}