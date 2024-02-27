import bcrypt from 'bcrypt'
import cfg from "../../config/config.json" assert { type: "json" }

const randomHash = (length) => {
    let t = 'abcdefghijklmnopqrstuvwxyz1234567890/$.'
    let hash = ''
    for (let i = 0; i < length; i++) {
        let code = Math.random() * (t.length - 1)
        code = Math.round(code)
        hash += Math.random() > 0.5 ? t[code] : t[code].toUpperCase()
    }
    hash = hash.replace(/\n/g, '%')
    return hash
}

function encrypt(text) {
    const hash = randomHash(cfg.security.prefixLength) + bcrypt.hashSync(text, 2) + randomHash(cfg.security.prefixLength)
    return hash
}

function compare(toCompare, trueComparation) {
    const comparationParsed = trueComparation.slice(cfg.security.prefixLength, trueComparation.length - cfg.security.prefixLength)
    return bcrypt.compareSync(toCompare, comparationParsed)
}

export { encrypt, compare }