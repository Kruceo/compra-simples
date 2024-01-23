import { useEffect, useState } from "react";
import Bar from "../Bar";
import Content from "../Content";
import SideBar from "../SideBar";

export default function ViewBotes(){

    const [data,setData] = useState(1) 

    useEffect(()=>{
        
    })

    return <>
        <Bar/>
        <SideBar/>
        <Content>
            
        </Content>
    </>
}