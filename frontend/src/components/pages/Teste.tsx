import backend from "../../constants/backend/backend";
import FormPrevisionInput from "../OverPageForm/FormPrevisionInput";

export default function Teste() {
    const d= backend.get("bote",{})
    return <div className="h-screen flex justify-center items-center w-screen">
        <FormPrevisionInput className="w-44"
            itemHandler={(e) => `${e.id} ${e.nome}`}
            searchInTable="fornecedor"
            where={{}}
            onSubmit={()=>null}
        ></FormPrevisionInput>
    </div>


}