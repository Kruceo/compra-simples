import sequelize from 'sequelize'

export default function literalBuilder(str) {
    let splited = str.split(".")
    let newTxt = splited.reduce((acum, each) => `${acum}${acum != '' ? "." : ""}"${each}"`, '')
    let col = sequelize.literal(newTxt)
    return str
}