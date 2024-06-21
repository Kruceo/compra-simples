import { PropsWithChildren } from "react";

export default function Content(props: PropsWithChildren & { className?: string, includeSubTopBar?: boolean }) {
    return <div className={`ml-sidebar-w mt-bar-h ${props.includeSubTopBar?"pt-12":""} ${props.className??""}`}>
        {props.children}
    </div>
}