import React from "react";

export default function Button(props: React.HtmlHTMLAttributes<HTMLButtonElement>) {
    const { className, ...restProps } = props
    return <button {...restProps} className={"hover:shadow-lg transition-shadow px-4 py-2 border-borders border-button-default rounded-button-default bg-submit text-submit-text font-bold focus:outline-selected " + className}>
        {props.children}
    </button>
}