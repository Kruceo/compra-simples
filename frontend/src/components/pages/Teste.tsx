import backend, { } from "../../constants/backend/backend";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { openPDF, writeHeader, writeTable } from "./Relatorios/reportInternals/libraryReports";
import { TRANSACTION_CLOSED } from "../../constants/codes";
import { getSigles } from "../../constants/stringUtils";

export default function Teste() {
    useEffect(() => {
        (async () => {
            
        })()
    },
        [])

    return <>
    </>
}