import { Op, where } from "sequelize";

function opBuilder(query) {

    if (!/(>)|(\^)|(<)|(=)|(!)|(\|)/.test(query)) return query

    var whereClause = {}

    const splited = query.split(",")
    splited.forEach((eac) => {
        let value = eac.slice(1)

        //Verificação se é um valor do tipo data (data do calendario), caso for, converte para Date
        if (/\d\d\d\d\-\d\d\-\d\dT\d\d:\d\d:\d\d\.\d+Z/.test(value)) value = new Date(value)

        switch (eac.slice(0, 1)) {
            case "<":
                whereClause = { ...whereClause, [Op.lt]: value }
                break;
            case ">":
                whereClause = { ...whereClause, [Op.gt]: value }
                break;
            case "^":
                whereClause = { ...whereClause, [Op.iLike]: "%" + eac.substring(1) + '%' }
                break;

            default:
                break;
        }

    })

    return whereClause
}

export default opBuilder