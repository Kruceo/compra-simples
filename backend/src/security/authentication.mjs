import jwt from 'jsonwebtoken'
import cfg from "../../config/config.json" assert { type: "json" }
import { Usuario } from '../database/tables.mjs'
import statusCodes from '../utils/statusCode.mjs'
import { compare } from './encrypt.mjs'

async function authenticateUser(user, password) {

    const finder = await Usuario.findOne({
        where: {
            nome: user
        }
    })

    if (!finder) return null

    if (!compare(password, finder.dataValues.senha)) return null

    const token = jwt.sign({ user, id: finder.dataValues.id }, cfg.security.jwt.secret, {
        expiresIn: cfg.security.jwt.tokenExpireTime
    })

    const expiresIn = calcExpiresIn(cfg.security.jwt.tokenExpireTime)


    return { token, expiresIn: expiresIn.toISOString() }

}

async function authenticateToken(token) {
    try {
        const verify = jwt.verify(token, cfg.security.jwt.secret)
        return verify
    } catch (error) {
        return null
    }
}
/**
 * A middleware to auto authenticate using cookies.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function authenticationMiddleware(req, res, next) {
    if (cfg.test) {
        req.auth = { user: (await Usuario.findOne()).dataValues }
        next()
        return;
    }
    if (!req.cookies || !req.cookies.token) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Autorização inválida ou inexistente." })
    const validadtion = await authenticateToken(req.cookies.token)

    //Provide the user to other services can use 
    req.auth = { user: validadtion }

    if (!validadtion) return res.status(statusCodes.Unauthorized).json({
        error: true, message: "Autorização inválida."
    })
    next()
}

function calcExpiresIn(str) {
    const key = str.replace(/\d+/, "")
    const value = parseInt(str.replace(/[a-z]/g, ""))
    const thisDate = new Date()
    if (key == "s") {
        thisDate.setSeconds(thisDate.getSeconds() + value)
    }
    if (key == "m") {
        thisDate.setMinutes(thisDate.getMinutes() + value)
    }
    if (key == "h") {
        thisDate.setHours(thisDate.getHours() + value)
    }
    if (key == "d") {
        thisDate.setDate(thisDate.getDate() + value)
    }
    return thisDate
}

export { authenticateUser, authenticateToken, authenticationMiddleware }