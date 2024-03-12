import express from 'express'
import { Usuario } from './src/database/tables.mjs'
import cfg from "./config/config.json" assert { type: "json" }
import authRouter from './src/routers/auth/loginRouter.mjs'
import { authenticationMiddleware } from './src/security/authentication.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import universalRouter from './src/routers/v1/router.mjs'

const app = express()

app.use(express.json({ limit: "2mb" }))
app.use(cookieParser())

if (!process.argv.includes("--disable-auth")) {
    app.use(cors({
        origin: cfg.server.cors.origin,
        credentials: cfg.server.cors.credentials // Certifique-se de configurar as credenciais como verdadeiras se estiver enviando cookies
    }));
    app.use('/v1', authenticationMiddleware, universalRouter)
}
else app.use('/v1', universalRouter)

app.use(authRouter)

await Usuario.findCreateFind({
    where: {
        nome: "admin",
        senha: "admin"
    }
})

app.listen(cfg.server.port, () => console.log(`Server running in ${cfg.server.port}`))