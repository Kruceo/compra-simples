import sequelize, { SequelizeScopeError } from 'sequelize'
import { blockedAttributes } from './tableUtils.mjs';


export default function attributeBuilder(text) {
    if (!text || text.trim() == '') return { exclude: blockedAttributes.toString() }
    if (/DROP|SELECT|select|drop/.test(text)) return;
    const splited = text.split(",")
    let attr = splited.map(each => {
        let parsedName = each.replace(/\(\w+?\)/g, '')
        let shortName = parsedName.replace(/\w+?\./g, '')
        //this blocks when the user calls /v1/usuario?attributes=senha
        if (blockedAttributes.includes(shortName)) return "blocked_password";
        let nick = (parsedName.match(/\w+\.\w+$/) ?? [shortName])[0].replace(".", "_")
        const fn = each.match(/(?<=\()\w+(?=\))/) ?? []

        switch (fn[0]) {
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