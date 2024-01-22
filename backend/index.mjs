import express from 'express'
import boteRouter from './src/routers/databaseRouter.v1.mjs'

const app = express()

app.use('/v1',boteRouter)

app.use(express.json({ limit: "1mb" }))

app.get("/testing",(req,res)=>res.send("ok"))

app.listen(8080)