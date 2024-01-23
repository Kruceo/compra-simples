import { Router } from "express";
import statusCodes from "../../utils/statusCode.mjs";
import { authenticateUser } from "../../security/authentication.mjs";

/**
 * @type {Router}
 */
const authRouter = new Router()

authRouter.post("/auth/login", async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) return res.status(statusCodes.BadRequest)
    .json({ error: true, message: "Falta de informação na requisição." })

    const token = await authenticateUser(user, password)
    if(!token) return res.status(statusCodes.Unauthorized)
    .json({ error: true, message: "Usuário ou senha invalidos" })

    res.json(token)
})

export default authRouter