function bDate(text: string) {
    return new Date(text).toLocaleDateString()
}

function extenseDate(d: Date) {
    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",


        "Dezembro"
    ]
    return d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear()
}


function getNextSaturday() {
    //0 = domingo
    const current = new Date()

    const daysUntilSaturday = 6 - current.getDay()

    const saturdayDate = new Date((daysUntilSaturday * 24 * 60 * 60 * 1000) + current.getTime())

    return saturdayDate
}
export { bDate, extenseDate, getNextSaturday }