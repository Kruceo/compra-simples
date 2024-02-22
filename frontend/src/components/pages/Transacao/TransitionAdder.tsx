import { useState } from "react"
import { BackendTableComp } from "../../../constants/backend"
import beautyNumber from "../../../constants/numberUtils"
import FormInput from "../../OverPageForm/FormInput"
import FormPrevisionInput from "../../OverPageForm/FormPrevisionInput"
import { RequiredLabel } from "../../OverPageForm/OverPageForm"

export default function TransitionItemAdder(props: { onSubmit: (item: BackendTableComp) => void }) {
    const [product, setProduct] = useState<BackendTableComp>()
    const [productPrice, setProductPrice] = useState<number>()
    const [productWeight, setProductWeight] = useState<number>()
    const [error, setError] = useState("")
    return <div className="p-4 min-h-44 grid grid-cols-4 gap-3">
        <div className="box-border col-span-4 mb-4">
            <RequiredLabel>Produto</RequiredLabel>
            <FormPrevisionInput
                errored={error == "product"}
                placeholder="Insira o codigo do produto"
                onChange={(value) => {
                    if (value) {
                        setProduct(value)
                        const priceEl: HTMLInputElement | null = document.querySelector('[name=price]')
                        if (priceEl && value.preco) {
                            priceEl.value = value.preco.toString()
                            setProductPrice(value.preco)
                        }
                    }
                }}
                name="product"
                searchInTable="produto"
                where={{}}
                itemHandler={(item) => `${item.id} - ${item.nome}`}
                onSubmit={() => null}
            />
        </div>

        <div className="box-border col-span-4 mb-4">
            <RequiredLabel>Preço</RequiredLabel>
            <FormInput
                errored={error == "price"}
                name="price"
                placeholder="Insira o preço do produto"
                onChange={(e) => setProductPrice(e.currentTarget.valueAsNumber)}
                type="number"
                step={0.01}
            />
        </div>

        <div className="box-border col-span-4">
            <RequiredLabel>Peso</RequiredLabel>
            <FormInput
                errored={error == "weight"}
                name="weight"
                type="number"
                step={0.01}
                onChange={(e) => setProductWeight(e.currentTarget.valueAsNumber)}
                placeholder="Insira o peso"
            />
        </div>

        <p className="col-span-4">Total:  {productPrice && productWeight ? beautyNumber(productPrice * productWeight) : "0,00"}</p>
        <div className="col-span-4">
            <button className="bg-submit text-submit-text font-bold rounded-sm py-2 px-4 box-border"
                onClick={() => {
                    if (!productWeight)
                        return setError('weight')
                    if (!productPrice)
                        return setError('price')
                    if (!product)
                        return setError('product')
                    setError("")
                    props.onSubmit(
                        {
                            id: Math.round(product?.id ?? -1 + Math.random() * 9999),
                            produto_id: product?.id,
                            preco: productPrice,
                            peso: productWeight,
                            valor_total: productPrice * productWeight,
                            produto: product
                        })
                    setProduct(undefined)
                    setProductPrice(undefined)
                    setProductWeight(undefined)
                    const weightEl: HTMLInputElement | null = document.querySelector("input[name=weight]")
                    const priceEl: HTMLInputElement | null = document.querySelector("input[name=price]")
                    const productEl: HTMLInputElement | null = document.querySelector("input[name=product]")

                    if (weightEl && priceEl && productEl) {
                        weightEl.value = ''
                        priceEl.value = ''
                        productEl.value = ''
                        productEl.dispatchEvent(new Event("blur"))

                        setTimeout(() => {
                            productEl?.focus()
                        }, 0)


                    }


                }

                } ><i>&#xe93a;</i> Adicionar</button>
        </div>
    </div>
}

