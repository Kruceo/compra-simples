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
        let nick = (parsedName.match(/\w+\.\w+$/)??[shortName])[0].replace(".","_")
        console.log(nick)
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
                break;
            default:
                return [sequelize.col(parsedName),nick]                
                break;
        }

        return item
    })


    return attr
}