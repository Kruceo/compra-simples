import React from "react";

interface FormInputAttributes extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    erroredClassName?: string,
    errored?: boolean | string
}

export default function FormInput(props: FormInputAttributes) {

    let { type, pattern, errored, erroredClassName, onInput, ...restProps } = props
    if (type == "float") {
        pattern = "^[0-9]+([.,][0-9]+)?$"
        type = "text"
        // onChange = (e) => { onChange ? onChange(e) : null }
    }
    if (type == "button" || type == "submit")
        return <input {...restProps} type={type} className={"bg-submit mt-4 p-2 font-bold rounded-sm cursor-pointer hover:brightness-125 " + props.className }  />
    return <input {...restProps} type={type} className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""} ${props.className}`} 
    onWheel={(e)=>e.currentTarget.blur()}
    />
}