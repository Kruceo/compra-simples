import { useContext, useEffect, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import FormInput from "../../OverPageForm/FormInput";
import { globalPopupsContext } from "../../../App";
import OverPageInfo from "../../Layout/OverPageInfo";
import FormSelection from "../../OverPageForm/FormSelection";

export default function BoteCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function,
    defaultValues?: BackendTableComp
}) {
    const [error, setError] = useState('')
    const { setGlobalPupupsByKey } = useContext(globalPopupsContext)
    const { onCancel, mode, afterSubmit, defaultValues } = props

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const nome = data.get("nome")
        const fornecedor_id = data.get("fornecedor_id")

        if (!nome) {
            setError("nome")
            return;
        }

        if (!fornecedor_id) {
            setError("fornecedor_id")
            return;
        }

        let response = null
        if (mode == 'creation') {
            response = await backend.create("bote", {
                nome: nome.toString(),
                fornecedor_id: parseInt(fornecedor_id.toString())
            })
        }
        if (mode == 'editing' && defaultValues && defaultValues.id) {
            const id = defaultValues.id
            response = await backend.edit("bote", id, {
                nome: data.get("nome")?.toString(),
                fornecedor_id: parseInt(fornecedor_id.toString())
            })
        }
        // Tratamento de erro
        if (response && response.error) {
            setGlobalPupupsByKey(4,
                <OverPageInfo onAccept={() => setGlobalPupupsByKey(4, null)}>
                    {response.message}
                </OverPageInfo>)
        }
        // EXIT if exists
        afterSubmit ? afterSubmit() : null
        onCancel()
    }
    
    return <>
        <OverPageForm
            onCancel={onCancel}
            title="Criação de Bote"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Barco Penha" defaultValue={defaultValues ? defaultValues.nome : undefined} errored={(error == "nome")} />

            <RequiredLabel>Fornecedor</RequiredLabel>

            <FormSelection name="fornecedor_id" defaultValue={defaultValues?.fornecedor?.id} useTable="Fornecedor" errored={error == "fornecedor_id"} />

            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

