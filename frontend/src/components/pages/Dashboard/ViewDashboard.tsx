import { useEffect } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import { useNavigate } from "react-router-dom";

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
    }, [])
    return <>
        <Bar />
        <SideBar />
        <Content className="flex">
            <div className="p-4 bg-subpanel border-borders border flex flex-col relative m-4 ml-auto">
                <h2>Atalhos</h2>
                <p>F8 - Criação de entradas</p>
                <p>F9 - Criação de saídas</p>
            </div>
            <img src="/icon.png" alt="icon" className="w-80 opacity-20 absolute ml-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
        </Content>
    </>
}