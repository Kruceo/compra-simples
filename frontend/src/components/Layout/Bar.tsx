import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import pkg from '../../../package.json'
import logo from "../../assets/icon.svg"

export default function Bar() {

    const [isOpenDropDown, setIsOpenDropDown] = useState(false)
    const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
    const [isMouseOverPanel, setIsMouseOverPanel] = useState(false)

    const clickHandler = () => {
        window.removeEventListener('click', clickHandler)
        if (isMouseOverIcon || isMouseOverPanel) {
            setIsOpenDropDown(true)
        }
        else setIsOpenDropDown(false)
    }
    const [newVersionDisponible, setNewVersionDisponible] = useState(false)

    useEffect(() => {
        window.addEventListener('click', clickHandler)
        return () => removeEventListener("click", clickHandler)
    }, [isMouseOverIcon, isMouseOverPanel])

    const user = Cookies.get("user")



    useEffect(() => {
        // version checker
        // armazena a versão e a data da ultima checagem no browser
        // verifica se a diferença entre datas é menor que 'expireTime'
        // se for, ele faz um novo fetch, caso não ele ainda checa a
        // ultima versão armazena e compara
        const storedWeek = window.localStorage.getItem("last-v-check-date")
        let needAfetch = true
        const expireTime = 24 * 60 * 60 * 1000
        if (storedWeek) {
            if (Date.now() - parseInt(storedWeek) < expireTime) {
                needAfetch = false
            }
        }

        if (needAfetch) {
            console.log("fetching version")
            fetch("https://raw.githubusercontent.com/Kruceo/easyfish/main/frontend/package.json").then((res) => res.json()
                .then(data => {
                    if (data.version != pkg.version) setNewVersionDisponible(true)
                    localStorage.setItem('last-v-check-date', Date.now().toString())
                    localStorage.setItem('last-v', data.version)
                }))
        }
        else {
            const storedVersion = localStorage.getItem('last-v')
            if (storedVersion != pkg.version) {
                setNewVersionDisponible(true)
            }
        }
    }, [])



    return <>

        <header className="bg-bar border-b-default border-borders w-full h-bar-h fixed left-0 top-0 flex items-center z-[51]">
            <div className="bg-[#2221] w-bar-h h-bar-h p-3 absolute">
                <img src={logo} alt="logo" className="opacity-25 hover:opacity-75 transition-[opacity]" />
            </div>
            <div className="ml-auto flex justify-center items-center gap-4 relative">
                <UserIcon
                    className="mr-2 hover:opacity-75 cursor-pointer"
                    tabIndex={1}
                    onMouseLeave={() => setIsMouseOverIcon(false)}
                    onMouseEnter={() => setIsMouseOverIcon(true)}
                />
                {
                    isOpenDropDown ? <div
                        onMouseLeave={() => setIsMouseOverPanel(false)}
                        onMouseEnter={() => setIsMouseOverPanel(true)}
                        className="px-4 top-full left-full  -translate-x-full absolute">
                        <div className="bg-subpanel border-borders border rounded-panel-default shadow-xl">
                            <div className="flex flex-col justify-center items-center p-4 min-w-40">
                                <UserIcon className="mb-2" />
                                <p className="capitalize font-bold text-current">{user}</p>
                            </div>
                            <div className="mx-4 pb-4 flex">
                                <p title={newVersionDisponible ? "Nova versão disponível" : "Versão"} className={`opacity-30 cursor-default ${newVersionDisponible ? "line-through" : ""}`}>{pkg.version}</p>
                                <Link to={"/login"} onClick={() => localStorage.setItem("auth-token", "-")} title="Sair" className="w-fit ml-auto flex items-center justify-end gap-2 text-red-500">
                                    Sair{/* <i>&#xea14;</i> */}
                                </Link>
                            </div>
                        </div>
                    </div>
                        : null
                }
            </div>
        </header>
    </>
}

function UserIcon(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={props.className + " bg-subpanel w-10 h-10 relative flex justify-center items-center rounded-full overflow-hidden transition-[opacity]"}>
        <i className='text-4xl text-default-text absolute top-[0.29rem]'>&#xe971;</i>
    </div>
} 