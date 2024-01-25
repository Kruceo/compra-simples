import React from "react";

interface FormInputAttributes extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    erroredClassName?:string,
    errored?:boolean|string
}

export default function FormInput(props: FormInputAttributes) {
    const errored = props.errored
    const cpProps ={...props}
    delete cpProps.errored

    if (props.type == "button" ||props.type == "submit")
        return <input {...cpProps} className="bg-submit mt-4 p-2 font-bold rounded-sm cursor-pointer hover:brightness-125" />
    return     <input {...cpProps} className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored?"border-red-600":""}`} />
}

