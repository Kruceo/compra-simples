import sequelize from 'sequelize'
import { blockedAttributes } from './tableUtils.mjs';


export default function attributeBuilder(text) {
    if (!text || text.trim() == '') return { exclude: blockedAttributes.toString() }

    const splited = text.split(",")
    let attr = splited.map(each => {
        let parsedName = each.replace(/\(\w+?\)/g, '')
        let shortName = parsedName.replace(/\w+?\./g, '')

        //this blocks when the user calls /v1/usuario?attributes=senha
        //this block /v1/usuario?attributes=(concat)nome+senha
        for (const part of parsedName.split(/\.| /)) {
            if (blockedAttributes.includes(part))
                throw new Error("Atributo bloqueado")
        }

        let nick = (parsedName.match(/\w+\.\w+$/) ?? [shortName])[0].replace(".", "_")
        const fn = each.match(/(?<=\()\w+(?=\))/) ?? []

        switch (fn[0]) {
            case "concat":
                const pairs = parsedName.split(/\+| /).reduce((acum, name) => {
                    if (/^".+"$/.test(name)) {
                        const str = name.replace(/"/g, "")
                        acum.push(sequelize.literal(`' ${str}'`), " ")
                    }
                    else {
                        acum.push(sequelize.col(name), " ")
                    }
                    return acum
                }, [])

                return [
                    sequelize.fn("CONCAT", ...pairs.slice(0, pairs.length - 1)),
                    nick.replace(/\+| /g, "_")
                ]
                break;
            case "sum":
                return [
                    sequelize.fn("SUM", sequelize.col(parsedName)),
                    nick
                ]
                break;
            case "count":
                return [
                    sequelize.fn("COUNT", sequelize.col(parsedName)),
                    nick
                ]
                break;
            case "min":
                return [
                    sequelize.fn("MIN", sequelize.col(parsedName)),
                    nick
                ]
                break;
            case "max":
                return [
                    sequelize.fn("MAX", sequelize.col(parsedName)),
                    nick
                ]
                break;
            case "avg":
                return [
                    sequelize.fn("AVG", sequelize.col(parsedName)),
                    nick
                ]
            case "day":
                return [
                    sequelize.fn(
                        'extract', sequelize.literal('day FROM "createdAt"')
                    ),
                    nick + '_day'
                ]
            case "month":
                return [
                    sequelize.fn(
                        'extract', sequelize.literal('month FROM "createdAt"')
                    ),
                    nick + '_month'
                ]
            case "year":
                return [
                    sequelize.fn(
                        'extract', sequelize.literal('year FROM "createdAt"')
                    ),
                    nick + '_year'
                ]
                break;
            default:
                return [sequelize.col(parsedName), nick]
                break;
        }
    })


    return attr
}