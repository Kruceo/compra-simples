import { Router } from "express";
import { Bote } from "../database/tables.mjs";

/**
 * @type {Router}
 */
const boteRouter = new Router()

boteRouter.post(`/create/bote`,(req,res)=>{
    const data = req.body
    console.log(data)
    res.end()
})

export default boteRouter