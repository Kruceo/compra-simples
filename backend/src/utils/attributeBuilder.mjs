import sequelize from 'sequelize'
import literalBuilder from './literalBuilder.mjs';

export default function attributeBuilder(text) {
    if (!text || text.trim() == '') return
    if (/DROP|SELECT|select|drop/.test(text)) return;
    console.log("\n----\n" + text + '\n\n\n')
    const splited = text.split(",")
    let attr = splited.map(each => {
        let parsedName = each.replace(/\(\w+?\)/g, '')
        let shortName = parsedName.replace(/\w+?\./g, '')
        const fn = each.match(/(?<=\()\w+(?=\))/) ?? []
       
        switch (fn[0]) {
            case "sum":
                return [
                    sequelize.fn("SUM", sequelize.col(parsedName)),
                    shortName
                ]
                break;
            case "count":
                return [
                    sequelize.fn("COUNT", sequelize.col(parsedName)),
                    shortName
                ]
                break;
            case "min":
                return [
                    sequelize.fn("MIN", sequelize.col(parsedName)),
                    shortName
                ]
                break;
            case "max":
                return [
                    sequelize.fn("MAX", sequelize.col(parsedName)),
                    shortName
                ]
                break;
            case "avg":
                return [
                    sequelize.fn("AVG", sequelize.col(parsedName)),
                    shortName
                ]
                break;
            default:
                return [sequelize.col(parsedName),shortName]                
                break;
        }

        return item
    })


    return attr
}