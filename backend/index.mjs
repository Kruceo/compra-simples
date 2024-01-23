import express from 'express'
import boteRouter from './src/routers/v1/boteRouter.mjs'

const app = express()

app.use(express.json({ limit: "22mb"}))

app.use('/v1',boteRouter)

app.get("/testing",(req,res)=>res.send("ok"))

app.listen(8080)