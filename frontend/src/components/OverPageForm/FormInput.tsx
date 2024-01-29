import React from "react";

interface FormInputAttributes extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    erroredClassName?: string,
    errored?: boolean | string
}

export default function FormInput(props: FormInputAttributes) {
    let { errored, erroredClassName, onChange, ...restProps } = props

    if (props.type == "button" || props.type == "submit")
        return <input {...restProps} className="bg-submit mt-4 p-2 font-bold rounded-sm cursor-pointer hover:brightness-125" />
    return <input {...restProps} className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""}`} />
}

