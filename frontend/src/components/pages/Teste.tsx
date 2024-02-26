import FormPrevisionInput from "../OverPageForm/FormPrevisionInput";
import { priceComparation } from "./Relatorios/priceComparation";

export default function Teste() {
    
    priceComparation(new Date(),new Date())
    
    return <div className="h-screen flex justify-center items-center w-screen">
        <FormPrevisionInput className="w-44"
            itemHandler={(e) => `${e.id} ${e.nome}`}
            searchInTable="fornecedor"
            where={{}}
            onSubmit={()=>null}
        ></FormPrevisionInput>
    </div>


}