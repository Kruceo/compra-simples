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

    useEffect(() => {
        window.addEventListener('click', clickHandler)
        return () => removeEventListener("click", clickHandler)
    }, [isMouseOverIcon, isMouseOverPanel])

    const user = Cookies.get("user")
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
                                <p className="opacity-30 cursor-default">{pkg.version}</p>
                                <Link to={"/login"} onClick={() => Cookies.set("token", "undefined")} title="Sair" className="w-fit ml-auto flex items-center justify-end gap-2 text-red-500">
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