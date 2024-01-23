import { Op, where } from "sequelize";

function opBuilder(query) {

    if (!/(>)|(<)|(=)|(!)|(\|)/.test(query)) return query

    var whereClause = {}

    const splited = query.split(",")
    splited.forEach((eac) => {
        switch (eac.slice(0, 1)) {
            case "<":
                whereClause = { ...whereClause, [Op.lt]: parseInt(eac.slice(1), 10) }
                break;
            case ">":
                whereClause = { ...whereClause, [Op.gt]: parseInt(eac.slice(1), 10) }
                break;

            default:
                break;
        }

    })

    return whereClause
}

export default opBuilder