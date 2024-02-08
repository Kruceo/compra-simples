import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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

    useEffect(() => window.addEventListener('click', clickHandler), [isMouseOverIcon, isMouseOverPanel])

    const user = Cookies.get("user")
    return <>

        <header className="bg-bar w-full h-14 fixed left-0 top-0 flex items-center border border-borders z-[51] shadow-sm">
            <div className="ml-auto flex justify-center items-center gap-4 relative">
                <UserIcon
                    className="mr-2"
                    tabIndex={1}
                    onMouseLeave={() => setIsMouseOverIcon(false)}
                    onMouseEnter={() => setIsMouseOverIcon(true)}
                />
                {
                    isOpenDropDown ? <div
                        onMouseLeave={() => setIsMouseOverPanel(false)}
                        onMouseEnter={() => setIsMouseOverPanel(true)}
                        className="px-4 top-full left-full -translate-x-full absolute">
                        <div className="bg-bar border-borders border shadow-xl">
                            <div className="flex flex-col justify-center items-center p-4 min-w-40">
                                <UserIcon className="mb-2" />
                                <p className="capitalize font-bold text-current">{user}</p>
                            </div>
                            <div className="mx-4 pb-4">
                                <Link to={"/login"} onClick={() => Cookies.set("token", "undefined")} title="Sair" className="w-fit ml-auto flex items-center justify-end gap-2 text-red-500">
                                    <i>&#xea14;</i>
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
    return <div {...props} className={props.className + " bg-current w-10 h-10 relative flex justify-center items-center rounded-full overflow-hidden"}>
        <i className='text-4xl text-subpanel absolute top-[0.29rem]'>&#xe971;</i>
    </div>
} 