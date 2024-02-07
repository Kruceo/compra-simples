import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";

export default function ViewDashboard() {
    return <>
        <Bar />
        <SideBar />
        <Content>
            <div className="w-fullWx">
                <img src="/icon.png" alt="icon" className="opacity-10" />
            </div>
        </Content>
    </>
}