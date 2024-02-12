import { useContext, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import FormInput from "../../OverPageForm/FormInput";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";

export default function VendorCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function,
    defaultValues?: BackendTableComp
}) {
    const [error, setError] = useState('')
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)

    const { onCancel, mode, afterSubmit, defaultValues } = props

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const nome = data.get("nome")

        if (!nome) {
            setError("nome")
            return;
        }
        let response = null
        if (mode == 'creation') {
            response = await backend.create("fornecedor", {
                nome: nome.toString()
            })
        }
        if (mode == 'editing' && defaultValues && defaultValues.id) {
            const id = defaultValues.id
            response = await backend.edit("fornecedor", id, {
                nome: nome.toString()
            })
        }
        // Tratamento de erro
        if (response && response.data.error && response.data.message) {
            simpleSpawnInfo(response.data.message)
        }
        // afterSubmit if exists
        afterSubmit ? afterSubmit() : null
        onCancel()
    }

    return <>
        <OverPageForm
            onCancel={onCancel}
            title="Criação de Fornecedor"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Dourado" defaultValue={defaultValues ? defaultValues.nome : undefined} errored={(error == "nome")} />

            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

