import { PropsWithChildren } from "react";

export default function Table(props: PropsWithChildren) {
    return <div>
        {props.children}
    </div>
}