import { ReactNode } from "react";
import Button from "./Button";

interface OverPageInfoAttributes {
    children: ReactNode,
    onAccept: Function,
    onRecuse?: Function,
    timer?: number
}

export default function OverPageInfo(props: OverPageInfoAttributes) {

    return <div className="bg-notification border-borders border rounded-sm shadow-xl p-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        {props.children}
        <div className="flex mt-4 gap-4">
            <Button
                autoFocus
                onClick={() => props.onAccept()}
            >
                Continuar
            </Button>
            {
                props.onRecuse ?
                    <Button
                        className="bg-red-400"
                        autoFocus
                        onClick={() => props.onRecuse ? props.onRecuse() : null}
                    >
                        Cancelar
                    </Button>
                    : null
            }
        </div>
    </div>
}