export interface OverPageFormAttributes extends React.HTMLAttributes<HTMLFormElement> {
    onCancel?: Function,
    title?: string,
}

export default function OverPageForm(props: OverPageFormAttributes) {

    const { onCancel, title, children, ...restProps } = props

    return <>
        <header className="w-screen h-screen left-0 top-0 fixed bg-[#0008] z-[51]" />
        <div className="bg-subpanel rounded-sm bg-red w-96 h-fit max-h-full p-4 z-[60] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl flex flex-col">
            <button className="opacity-30 ml-auto mb-4 hover:opacity-100 cursor-pointer"
                onClick={() => onCancel ? onCancel() : null} >
                <i title="Cancelar" className="hover:text-red-600">&#xea0f;</i>
            </button>
            {
                title ?
                    <h2 className="w-full text-center mb-8"><strong>{props.title}</strong></h2>
                    : null
            }
            <form className="flex flex-col" {...restProps}>
                {children}
            </form>
        </div>
    </>

}


export function RequiredLabel(props: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>) {
    return <label {...props} className="mb-2">
        <strong>{props.children}<span className="opacity-50">*</span></strong>
    </label>
}