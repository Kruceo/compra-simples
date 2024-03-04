import React from "react";

export default function Button(props: React.HtmlHTMLAttributes<HTMLButtonElement>) {
    const { className, ...restProps } = props
    return <button {...restProps} className={"px-4 py-2 rounded-sm bg-submit text-submit-text font-bold hover:brightness-125 focus:outline-white " + className}>
        {props.children}
    </button>
}