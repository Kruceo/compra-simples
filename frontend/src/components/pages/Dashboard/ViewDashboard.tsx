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

    // function genRandomData() {
    //     let len = 10 + Math.floor(Math.random() * 26) - 10

    //     let data = []

    //     for (let i = 0; i < len; i++) {
    //         data.push(Math.floor(Math.random() * 256))
    //     }

    //     return data
    // }

    return <>
        <Bar />
        <SideBar />
        <Content className="flex">
            <HelpButton content={"F8 - Nova entrada\nF9 - Nova saída"} className="absolute left-full -translate-x-full z-50" />
            <img src={logo} alt="icon" className="w-80 opacity-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* <svg width={"256"} height={"256"} viewBox="256 256" className="border-borders border rounded-md m-4 w-full">
                <path d={"M0 0 " + (() => genRandomData().reduce((acum, next, index) => acum + "L" + (index * 10) + " " + next + " ", ""))()} stroke="#ff0" fill="none" />
            </svg> */}
        </Content>
    </>
}