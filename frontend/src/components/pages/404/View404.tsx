import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";

export default function View404() {
    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="px-4 pt-8 w-full text-center">Essa pagina não existe.</h2>
            <h1 className="px-4 w-full text-center">404</h1>
        </Content>
    </>
}