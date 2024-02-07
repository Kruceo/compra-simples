import { useState } from "react";
import SubTopBar, { ToolBarButton } from "../Layout/SubTopBar";

interface TableToolBarAttributes {
    createHandler: React.MouseEventHandler<HTMLButtonElement>,
    searchHandler: (search: string) => void
}

export default function TableToolBar(props: TableToolBarAttributes) {
    const { createHandler, searchHandler } = props
    const [search, setSearch] = useState("")

    return <SubTopBar
        // leftContent={selected.length > 0 ? selected.length + ' itens selecionados' : ''}
        leftContent={<div className="flex border-border border-b ml-4">
            <input type="text" placeholder="Pesquisar" className="bg-transparent outline-none" onChange={(e) => setSearch(e.target.value)} />
            <button title="Pesquisar" onClick={() => searchHandler(search)}>
                <i className="text-borders hover:text-inherit">&#xe986;</i>
            </button>
        </div>}
    >
        {/* <ToolBarButton className="hover:bg-yellow-100"><i>&#xe954;</i> Imprimir</ToolBarButton> */}
        <ToolBarButton title="Clique para criar" className="hover:bg-green-100" onClick={createHandler}>
            <i>&#xea3b;</i> Criar
        </ToolBarButton>

    </SubTopBar>
}