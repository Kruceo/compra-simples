import { Router } from "express";
import statusCodes from "../../utils/statusCode.mjs";
import { authenticateToken, authenticateUser } from "../../security/authentication.mjs";

/**
 * @type {Router}
 */
const authRouter = new Router()

authRouter.post("/auth/login", async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) return res.status(statusCodes.BadRequest)
        .json({ error: true, message: "Falta de informação na requisição." })

    const token = await authenticateUser(user, password)
    if (!token) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Usuário ou senha inválido." })

    res.json(token)
})

authRouter.get("/auth/validate", async (req, res) => {

    const token = req.cookies.token

    if (!token) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Sem as credenciais necessárias." })

    const resolvedToken = await authenticateToken(token)

    if (!resolvedToken) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Autenticação inválida." })

    res.json(resolvedToken)
})

export default authRouter