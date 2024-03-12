import { Op } from "sequelize";

function opBuilder(query) {

    var clause = {}

    const splited = query.split(",")
    splited.forEach((fullString) => {
        let operator = fullString.slice(0, 1)
        let value = fullString.slice(1)
        //Verificação se é um valor do tipo data (data do calendario), caso for, converte para Date
        if (/\d\d\d\d\-\d\d\-\d\dT\d\d:\d\d:\d\d\.\d+Z/.test(value)) value = new Date(value)

        switch (operator) {
            case "<":
                clause = { ...clause, [Op.lt]: value }
                break;
            case ">":
                clause = { ...clause, [Op.gt]: value }
                break;
            case "^":
                clause = { ...clause, [Op.iLike]: "%" + value.substring(1) + '%' }
                break;
            case "|":
                clause = { ...clause, [Op.or]: value.split("|") }
                break;
            case "!":
                clause = { ...clause, [Op.not]: value }
                break;

            default:
                clause = { ...clause, [Op.eq]: fullString }
                break;
        }

    })

    return clause
}

export default opBuilder