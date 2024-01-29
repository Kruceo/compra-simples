import { useContext, useState } from "react";
import backend, { BackendTableComp } from "../../../constants/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import FormInput from "../../OverPageForm/FormInput";
import { globalPopupsContext } from "../../../App";
import OverPageInfo from "../../OverPageInfo";

export default function ProdutoCreationForm(props: {
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
                preco:parseFloat(preco.toString())
            })
        }
        if (mode == 'editing' && defaultValues && defaultValues.id) {
            const id = defaultValues.id
            response = await backend.edit("produto", id, {
                nome: nome.toString(),
                preco:parseFloat(preco.toString())
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
            title="Criação de Produto"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Dourado" defaultValue={defaultValues ? defaultValues.nome : undefined} errored={(error == "nome")} />

            <RequiredLabel htmlFor="preco">Preço</RequiredLabel>
            <FormInput name="preco" type="float" placeholder="Preço" defaultValue={defaultValues ? defaultValues.preco : undefined} errored={(error == "preco")} />

            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

