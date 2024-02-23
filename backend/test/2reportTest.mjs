import { Transacao, Transacao_item } from "../src/database/tables.mjs";

console.log(await Transacao.findAll({raw:true,include:[Transacao_item]}))