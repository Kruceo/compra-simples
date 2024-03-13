import { useState } from "react"
import beautyNumber from "../../../constants/numberUtils"
import FormInput from "../../OverPageForm/FormInput"
import FormPrevisionInput from "../../OverPageForm/FormPrevisionInput"
import { RequiredLabel } from "../../OverPageForm/OverPageForm"
import Button from "../../Layout/Button"

export default function TransitionItemAdder(props: { onSubmit: (item: transacaoitemProps) => void }) {
    const [product, setProduct] = useState<produtoProps>()
    const [productPrice, setProductPrice] = useState<number>()
    const [productWeight, setProductWeight] = useState<number>()
    const [error, setError] = useState("")
    return <div className="p-4 min-h-44 grid grid-cols-4 gap-3">
        <div className="box-border col-span-4 mb-4">
            <RequiredLabel className="col-span-4">Produto</RequiredLabel>
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
                next="#priceInput"
            />
        </div>

        <div className="box-border col-span-4 mb-4">
            <RequiredLabel>Preço</RequiredLabel>
            <FormInput
                next="#weightInput"
                id="priceInput"
                className="w-full"
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
                id="weightInput"
                className="w-full"
                errored={error == "weight"}
                name="weight"
                type="number"
                step={0.01}
                onChange={(e) => setProductWeight(e.currentTarget.valueAsNumber)}
                placeholder="Insira o peso"
                next="#adderSubmit"
            />
        </div>

        <p className="col-span-4">Total:  {productPrice && productWeight ? beautyNumber(productPrice * productWeight) : "0,00"}</p>
        <div className="col-span-4">
            <Button id="adderSubmit"
                onClick={() => {
                    const weightEl: HTMLInputElement | null = document.querySelector("input[name=weight]")
                    const priceEl: HTMLInputElement | null = document.querySelector("input[name=price]")
                    const productEl: HTMLInputElement | null = document.querySelector("input[name=product]")

                    if (!productWeight) {
                        setTimeout(() => weightEl?.focus(), 200)
                        return setError('weight')
                    }
                    if (!productPrice) {
                        setTimeout(() => priceEl?.focus(), 200)
                        return setError('price')
                    }
                    if (!product) {
                        setTimeout(() => productEl?.focus(), 200)
                        return setError('product')
                    }
                    setError("")
                    props.onSubmit(
                        {
                            transacao_id: -1,
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


                    if (weightEl && priceEl && productEl) {
                        weightEl.value = ''
                        priceEl.value = ''
                        productEl.value = ''
                        productEl.dispatchEvent(new Event("blur"))

                        setTimeout(() => {
                            productEl?.focus({ preventScroll: false })
                            window.scrollBy({ top: productEl.clientTop })

                        }, 200)


                    }


                }

                } ><i>&#xe93a;</i> Adicionar</Button>
        </div>
    </div>
}

