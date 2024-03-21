import React, { useState } from "react"
import { Link } from "react-router-dom"

export default function SideBar() {
    return <>
        <nav className="bg-sidebar border-r border-borders w-44 mt-14 h-full fixed left-0 top-0 flex flex-col shadow-lg z-50">
            <PanelLink href="/"><i>&#xe900;</i>Dashboard</PanelLink>
            <DropButton
                title="Cadastro"
                dropDownContent={<>
                    <PanelLink href="/view/produto">Produtos</PanelLink>
                    <PanelLink href="/view/fornecedor">Fornecedores</PanelLink>
                    <PanelLink href="/view/bote">Botes</PanelLink>
                </>}>
                <i>&#xe905;</i> Cadastro
            </DropButton>
            <DropButton
                title="Transação"
                dropDownContent={<>
                    <PanelLink href="/create/entrada">Nova Entrada</PanelLink>
                    <PanelLink href="/create/saida">Nova Saída</PanelLink>
                    <PanelLink href="/view/transacao">Listagem</PanelLink>
                    {/* <PanelLink href="/close/transacao">Fechamento</PanelLink> */}
                </>}>
                <i>&#xe935;</i> Transação
            </DropButton>
            <DropButton
                title="Relatórios"
                dropDownContent={<>
                    <PanelLink href="/report/1">Comparativo de Preços</PanelLink>
                    <PanelLink href="/report/2">Comparativo de Botes</PanelLink>
                    <PanelLink href="/report/3">Comparativo por Mês</PanelLink>
                    <PanelLink href="/report/4">Itens da Transação</PanelLink>
                </>}>

                <i>&#xe99c;</i> Relatório
            </DropButton>
            <DropButton
                title="Recibos"
                dropDownContent={<>
                    <PanelLink href="/receipt/once">Avulso</PanelLink>
                    <PanelLink href="/receipt/transaction">Por transação</PanelLink>
                </>}>

                <i>&#xe93b;</i> Recibos
            </DropButton>
        </nav>

    </>
}

interface DropButtonAttributes extends React.HTMLAttributes<HTMLButtonElement> {
    dropDownContent: React.ReactNode | React.ReactNode[],
    dropDownContainerLeft?: number | string
    dropDownContainerTop?: number | string
}

export function DropButton(props: DropButtonAttributes) {
    const [focused, setFocused] = useState(false)
    const [isMouseOverSubPanel, setIsMouseOverSubPanel] = useState(false)

    const { dropDownContent, dropDownContainerLeft, dropDownContainerTop, ...restProps } = props

    return <>
        <button {...restProps} className={props.className + " h-14 relative focus:bg-hovers hover:bg-hovers"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <div className="gap-2 flex px-4 w-full">
                {props.children}
                <span className="ml-auto">&gt;</span>
            </div>
            {
                (focused || isMouseOverSubPanel) ?
                    <header onMouseOver={() => setIsMouseOverSubPanel(true)}
                        onMouseLeave={() => setIsMouseOverSubPanel(false)}
                        style={{ left: dropDownContainerLeft ?? "100%", top: dropDownContainerTop }}
                        className="bg-subpanel outline outline-1 outline-borders min-w-28 w-fit h-fit absolute top-0 flex flex-col text-nowrap shadow-xl">
                        {dropDownContent}
                    </header>
                    : null
            }
        </button >
    </>
}

function PanelLink(props: React.HTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return <Link className="transition-colors hover:bg-hovers text-default-text font-normal text-left h-14 flex items-center px-4 gap-2" to={props.href}>{props.children}</Link>
}