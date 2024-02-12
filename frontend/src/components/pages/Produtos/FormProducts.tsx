import { useContext, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import FormInput from "../../OverPageForm/FormInput";

import OverPageInfo from "../../Layout/OverPageInfo";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";

export default function ProductCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function,
    defaultValues?: BackendTableComp
}) {
    const [error, setError] = useState('')
    const { setGlobalPopupByKey } = useContext(GlobalPopupsContext)

    const { onCancel, mode, afterSubmit, defaultValues } = props

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const nome = data.get("nome")
        const preco = data.get("preco")

        if (!nome) {
            setError("nome")
            return;
        }
        if (!preco) {
            setError("preco")
            return;
        }
        let response = null
        if (mode == 'creation') {
            response = await backend.create("produto", {
                nome: nome.toString(),
                preco: parseFloat(preco.toString())
            })
        }
        if (mode == 'editing' && defaultValues && defaultValues.id) {
            const id = defaultValues.id
            response = await backend.edit("produto", id, {
                nome: nome.toString(),
                preco: parseFloat(preco.toString())
            })
        }
        // Tratamento de erro
        if (response && response.data.error) {
            setGlobalPopupByKey("EditForm",
                <OverPageInfo onAccept={() => setGlobalPopupByKey("EditForm", null)}>
                    {response.data.message}
                </OverPageInfo>)
        }
        // EXIT if exists
        afterSubmit ? afterSubmit() : null
        onCancel()
    }

    return <>
        <OverPageForm
            onCancel={onCancel}
            title="Criação de Produto"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Dourado" defaultValue={defaultValues ? defaultValues.nome : undefined} errored={(error == "nome")} />

            <RequiredLabel htmlFor="preco">Preço</RequiredLabel>
            <FormInput name="preco" type="number" step={0.01} placeholder="Insira o preço" defaultValue={defaultValues ? defaultValues.preco : undefined} errored={(error == "preco")} />

            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

