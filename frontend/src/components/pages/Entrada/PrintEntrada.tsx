import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";

export default function PrintEntrada(){
    return <>
        <Bar/>
        <SideBar/>
        <Content>
            Futura tela de impressão...
        </Content>
    </>
}