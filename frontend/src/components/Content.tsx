import { PropsWithChildren } from "react";

export default function Content(props:PropsWithChildren){
    return <div className="ml-44 mt-14">
        {props.children}
    </div>
}