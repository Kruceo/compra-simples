import { useEffect } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { useNavigate } from "react-router-dom";
import HelpButton from "../../Layout/HelpButton";
import logo from '../../../assets/icon.svg'


export default function ViewDashboard() {
    const navigate = useNavigate()
    const keyListenerHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "F8":
                navigate('/create/entrada')
                window.removeEventListener('keyup', keyListenerHandler)
                break;
            case "F9":
                navigate('/create/saida')
                window.removeEventListener('keyup', keyListenerHandler)
                break;

            default:
                break;
        }
    }
    useEffect(() => {
        window.addEventListener("keyup", keyListenerHandler)
        return () => window.removeEventListener("keyup", keyListenerHandler)
    }, [])

    // remove date settings saved from CreateEntry.tsx page
    window.localStorage.removeItem("datemode")
    window.localStorage.removeItem("custom-date")

    return <>
        <Bar />
        <SideBar />
        <Content className="flex">
            <HelpButton content={"F8 - Nova entrada\nF9 - Nova saída"} className="absolute left-full -translate-x-full z-50" />
            <img src={logo} alt="icon" className="w-80 opacity-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Content>
    </>
}