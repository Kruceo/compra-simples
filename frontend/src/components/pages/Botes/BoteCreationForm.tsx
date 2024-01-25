import { ReactNode, useState } from "react";
import backend from "../../../constants/backend";
import OverPageForm from "../../OverPageForm";
import FormInput from "../../FormInput";

export default function BoteCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function
}) {

    const [error, setError] = useState('')

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const nome = data.get("nome")

        if (!nome) {
            setError("nome")
            return;
        }

        if (props.mode == 'creation') {
            const response = await backend.create("bote", {
                nome: data.get("nome")?.toString()
            })
        }
        // EXIT if exists
        props.afterSubmit ? props.afterSubmit() : null
        props.onCancel()
    }

    // const [extraContent, setExtraContent]: [React.ReactNode[], React.Dispatch<React.SetStateAction<React.ReactNode[]>>] =
    //     useState<React.ReactNode[]>([]);

    // const setExtraContentByKey = (key: number, content: ReactNode) => {
    //     let mockup = [...extraContent]
    //     mockup[key] = content
    //     setExtraContent(mockup)
    // }

    return <>
        {/* {extraContent} */}
        <OverPageForm
            {...props}
            title="Criação de Bote"
            onSubmit={submitHandler}
        >
            <label className="mb-2" htmlFor="nome">
                <strong>Nome<span className="opacity-50">*</span></strong>
            </label>
            <FormInput name="nome" type="text" placeholder="E.g Barco Penha" errored={(error == "nome")} />
            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

