import jwt from 'jsonwebtoken'
import cfg from "../../config/config.json" assert { type: "json" }
import { Usuario } from '../database/tables.mjs'
import statusCodes from '../utils/statusCode.mjs'

async function authenticateUser(user, password) {

    const finder = await Usuario.findOne({
        where: {
            nome: user, senha: password
        }
    })

    if (!finder) return null

    const token = jwt.sign({ user, id: finder.dataValues.id }, cfg.security.secret, {
        expiresIn: cfg.security.tokenExpireTime
    })

    return { token }

}

async function authenticateToken(token) {
    try {
        const verify = jwt.verify(token, cfg.security.secret)
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
    
    if(!validadtion)return res.status(statusCodes.Unauthorized).json({
        error:true,message:"Autorização inválida."
    })
    next()
}

export { authenticateUser, authenticateToken, authenticationMiddleware }