import { PropsWithChildren } from "react";

export default function Content(props: PropsWithChildren & { className?: string }) {
    return <div className={"ml-44 mt-14 " + props.className}>
        {props.children}
    </div>
}