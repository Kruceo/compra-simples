import React from "react";

export interface DefaultFormInput {
    next?: string
}

interface FormInputAttributes extends DefaultFormInput, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    erroredClassName?: string,
    errored?: boolean | string,
}

export default function FormInput(props: FormInputAttributes) {
    let { type, pattern, next, errored, erroredClassName, onInput, className,...restProps } = props
    if (type == "float") {
        pattern = "^[0-9]+([.,][0-9]+)?$"
        type = "text"
        // onChange = (e) => { onChange ? onChange(e) : null }
    }
    if (type == "button" || type == "submit")
        return <input
            {...restProps}
            type={type}
            className={"bg-submit mt-4 p-2 font-bold cursor-pointer hover:brightness-125  border-borders border-button-default rounded-button-default " + className}
        />
    return <input
        {...restProps}
        onKeyUp={(e) => defaultKeyUpHandler(e, next)}
        type={type}
        className={`bg-transparent px-3 py-2 border-borders border-input-default rounded-input-default outline-none ${errored ? "border-red-600" : ""} ${className}`}
        onWheel={(e) => e.currentTarget.blur()}
    />
}

export function defaultKeyUpHandler(e: React.KeyboardEvent<HTMLInputElement|HTMLOptionElement>, next?: string) {
    if (e.key == 'Enter' && next) {
        const el: HTMLInputElement | null = document.querySelector(next)
        el?.focus()
        window.scrollBy({top:el?.clientTop})
    }
}