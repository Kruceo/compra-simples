import bcrypt from 'bcrypt'
// import cfg from "../../config/config.json" assert { type: "json" }

const randomHash = () => {
    let t = 'abcdefghijklmnopqrstuvwxyz1234567890/$.'
    let hash = ''
    for (let i = 0; i < 6; i++) {
        let code = Math.random() * (t.length - 1)
        code = Math.round(code)
        hash += Math.random() > 0.5 ? t[code] : t[code].toUpperCase()
    }
    hash = hash.replace(/\n/g, '%')
    return hash
}

function encrypt(text) {
    const hash = randomHash() + bcrypt.hashSync(text, 2) + randomHash()
    return hash
}

function compare(toCompare, trueComparation) {
    const comparationParsed = trueComparation.slice(6, trueComparation.length - 6)
    return bcrypt.compareSync(toCompare, comparationParsed)
}

export { encrypt, compare }