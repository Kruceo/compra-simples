import { PropsWithChildren, ReactNode, useEffect } from "react";

interface OverPageInfoAttributes{
    children:ReactNode,
    onTimeout:Function,
    timer?:number
}

export default function OverPageInfo(props:OverPageInfoAttributes){

    useEffect(()=>{
        setTimeout(()=>{
            props.onTimeout()
        },props.timer??5000)
    },[])

    return <div className="bg-notification border-borders border rounded-sm shadow-xl p-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {props.children}
    </div>
}