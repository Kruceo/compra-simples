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
            <iframe className="w-full min-h-96" src="http://192.168.0.10:3000/public-dashboards/0a3787b579304dcdbf51106f5ad45f8b?theme=light" frameBorder="1"></iframe>
        </Content>
    </>
}