import React from "react";

interface FormInputAttributes extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    erroredClassName?: string,
    errored?: boolean | string
}

export default function FormInput(props: FormInputAttributes) {

    let { type, pattern, errored, erroredClassName, onChange, onInput, ...restProps } = props
    if (type == "float") {
        pattern = "^[0-9]+([.,][0-9]+)?$"
        type = "text"
        onChange = (e) => { onInputFloatType(e); onChange ? onChange(e) : null }
    }
    if (type == "button" || type == "submit")
        return <input {...restProps} type={type} className="bg-submit mt-4 p-2 font-bold rounded-sm cursor-pointer hover:brightness-125" />
    return <input {...restProps} type={type} onChange={onChange} className={`bg-transparent px-3 py-2 border-borders border outline-none ${errored ? "border-red-600" : ""}`} />
}

function onInputFloatType(event: React.ChangeEvent<HTMLInputElement>) {
    var inputElement = event.target;

    var inputValue = inputElement.value

    // Remover caracteres não permitidos, exceto a primeira vírgula ou ponto
    var newValue = inputValue.replace(/[^0-9.,]|(?<=[:.,])[\d\D]*[.,]/g, '');

    // Atualizar o valor do campo
    inputElement.value = newValue;
}