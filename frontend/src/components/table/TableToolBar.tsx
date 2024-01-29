import { useState } from "react";
import SubTopBar, { ToolBarButton } from "../SubTopBar";

interface TableToolBarAttributes {
    selected: number[],
    createHandler: React.MouseEventHandler<HTMLButtonElement>,
    editHandler: React.MouseEventHandler<HTMLButtonElement>,
    deleteHandler: React.MouseEventHandler<HTMLButtonElement>,
    searchHandler: (search: string) => void
}

export default function TableToolBar(props: TableToolBarAttributes) {
    const { selected, createHandler, deleteHandler, editHandler } = props
    const [search, setSearch] = useState("")

    return <SubTopBar
        // leftContent={selected.length > 0 ? selected.length + ' itens selecionados' : ''}
        leftContent={<div className="flex border-border border-b ml-4">
            <input type="text" placeholder="Pesquisar" className="bg-transparent" onChange={(e) => setSearch(e.target.value)} />
            <button title="Pesquisar" onClick={() => props.searchHandler(search)}>
                <i className="text-borders hover:text-inherit">&#xe986;</i>
            </button>
        </div>}
    >
        {/* <ToolBarButton className="hover:bg-yellow-100"><i>&#xe954;</i> Imprimir</ToolBarButton> */}
        <ToolBarButton title="Clique para criar" className="hover:bg-green-100" onClick={createHandler}>
            <i>&#xea3b;</i> Criar
        </ToolBarButton>
        <ToolBarButton title="Selecione para editar" className="hover:bg-blue-100" onClick={editHandler} enabled={selected.length > 0 && selected.length < 2}>
            <i>&#xe905;</i> Editar
        </ToolBarButton>
        <ToolBarButton title="Selecione para excluir" className="hover:bg-red-100" onClick={deleteHandler} enabled={selected.length > 0}>
            <i>&#xe9ac;</i> Excluir
        </ToolBarButton>
    </SubTopBar>
}