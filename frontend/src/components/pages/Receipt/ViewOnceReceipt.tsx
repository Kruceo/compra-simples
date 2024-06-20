import { useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import jsPDF from "jspdf";
import FormInput from "../../OverPageForm/FormInput";
import Button from "../../Layout/Button";
import { dateSetter } from "../Reports/ViewPriceComparationReport";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import { WriteReceipt2PDF } from "./libReceipt";
import { openPDF } from "../Reports/reportInternals/libraryReports";
export default function ViewReceipt() {
    const [date, setDate] = useState<Date | null>(null)
    const [value, setValue] = useState<number | null>(null)
    const [personName, setPersonName] = useState<string | null>(null)
    const [referenceTo, setReferenceTo] = useState<string | null>("PAGTO FORNECIMENTO DE MERCADORIAS")
    const [receiptNumber, setReceiptNumber] = useState<number | null>(null)
    const [error, setError] = useState("")
    function createReceipt() {
        if (!date) return setError("date")
        if (!value) return setError("value")
        if (!personName) return setError("person")

        setError("")
        const pdf = new jsPDF()
        WriteReceipt2PDF(pdf, 5, value, personName, date, referenceTo ?? undefined, receiptNumber ?? undefined)
        openPDF(pdf)
    }

    return <>
        <Bar />
        <SideBar />
        <Content>
            <h2 className="p-4">Recibo - Avulso</h2>
            <div className="p-4 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <RequiredLabel>Data</RequiredLabel>
                        <FormInput type="date"
                            errored={error == 'date'}
                            onChange={(e) => dateSetter(e.target.value, 24, 0, 1, setDate)} />
                    </div>
                    <div className="flex flex-col">
                        <RequiredLabel>Valor</RequiredLabel>
                        <FormInput
                            errored={error == 'value'}
                            type="number" step={0.01}
                            placeholder="Insira um valor"
                            onChange={(e) => setValue(e.currentTarget.valueAsNumber)} />
                    </div>
                </div>
                <RequiredLabel>Nome</RequiredLabel>
                <FormInput
                    errored={error == 'person'}
                    type="text"
                    placeholder="Insira um nome"
                    onChange={(e) => setPersonName(e.currentTarget.value)} />
                <RequiredLabel>Descrição</RequiredLabel>
                <FormInput
                    errored={error == 'referenceTo'}
                    type="text"
                    defaultValue={"PAGTO FORNECIMENTO DE MERCADORIAS"}
                    placeholder="Insira uma descrição"
                    onChange={(e) => setReferenceTo(e.currentTarget.value)} />
                <RequiredLabel>Numero</RequiredLabel>
                <FormInput
                    errored={error == 'receiptN'}
                    type="number"
                    placeholder="Insira o numero"
                    onChange={(e) => setReceiptNumber(e.currentTarget.valueAsNumber)} />
                < Button className="hover:bg-green-100 mt-4 mx-auto" onClick={createReceipt}>
                    <i>&#xe926;</i> Pronto
                </Button>
            </div>
        </Content>
    </>
}