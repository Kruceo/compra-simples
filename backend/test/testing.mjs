import { Bote, Transacao } from "../src/database/tables.mjs";

await Transacao.update({valor:223213123,createdAt:new Date('1988-01-01T00:00:00Z')}, { where: { id: 41 } })