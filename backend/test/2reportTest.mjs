import { Transacao, Transacao_item } from "../src/database/tables.mjs";
import includeBuilder from '../src/utils/includeBuilder.mjs'

const inc = includeBuilder("bote{fornecedor},transacao_item{produto}");
(await import('fs')).writeFileSync("./test.json",JSON.stringify(inc,null,2))