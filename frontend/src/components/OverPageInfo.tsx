import { ReactNode, useEffect } from "react";

interface OverPageInfoAttributes {
    children: ReactNode,
    onAccept: Function,
    onRecuse?: Function,
    timer?: number
}

export default function OverPageInfo(props: OverPageInfoAttributes) {

    return <div className="bg-notification border-borders border rounded-sm shadow-xl p-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {props.children}
        <div className="flex">
            <button
                onClick={() => props.onAccept()}
                className="bg-white bg-opacity-20 mt-6 font-bold ml-auto border-borders border px-4 py-2 hover:bg-opacity-70">
                Continuar
            </button>
            {
                props.onRecuse ?
                    <button
                        onClick={() => props.onRecuse ? props.onRecuse() : null}
                        className="bg-white bg-opacity-20 mt-6 font-bold ml-4 border-borders border px-4 py-2 hover:bg-opacity-70">
                        Cancelar
                    </button>
                    : null
            }

        </div>
    </div>
}