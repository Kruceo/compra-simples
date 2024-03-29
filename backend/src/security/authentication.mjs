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

    return { token }

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

export { authenticateUser, authenticateToken, authenticationMiddleware }