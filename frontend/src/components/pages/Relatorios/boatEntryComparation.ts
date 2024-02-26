import jsPDF from "jspdf";
import backend from "../../../constants/backend";
import { writeHeader } from "./libraryReports";

export async function boatEntryComparation() {

    const pdf = new jsPDF()

    const resTransicao = await backend.get("transacao", {include:"transacao_item,bote"})
    console.log(resTransicao)
    if (resTransicao.data.error || !resTransicao.data.data) return alert('error 001 /boatEntryComparation')
    
    writeHeader(pdf, 'teste', new Date(), new Date())



    pdf.text(JSON.stringify(resTransicao.data.data,null,2),10,30)






    const dadosDoPDF = pdf.output('dataurlstring');

    // Cria uma nova janela ou guia do navegador e abre o PDF
    const novaJanela = window.open();
    if (novaJanela)
        novaJanela.document.write('<iframe width="100%" height="100%" src="' + dadosDoPDF + '"></iframe>');

}