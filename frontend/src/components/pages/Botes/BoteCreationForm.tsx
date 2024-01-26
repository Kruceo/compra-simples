import { ReactNode, useContext, useState } from "react";
import backend from "../../../constants/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm";
import FormInput from "../../FormInput";
import { globalPopupsContext } from "../../../App";
import OverPageInfo from "../../OverPageInfo";

export default function BoteCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function
}) {

    const [error, setError] = useState('')

    const { setGlobalPupupsByKey } = useContext(globalPopupsContext)

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
            if (response.error) {
                // Tratamento de erro
                setGlobalPupupsByKey(4,
                    <OverPageInfo onAccept={() => setGlobalPupupsByKey(4, null)}>
                        {response.message}
                    </OverPageInfo>)
            }
        }
        // EXIT if exists
        props.afterSubmit ? props.afterSubmit() : null
        props.onCancel()
    }

    return <>
        {/* {extraContent} */}
        <OverPageForm
            {...props}
            title="Criação de Bote"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Barco Penha" errored={(error == "nome")} />
            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

