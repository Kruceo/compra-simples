import sequelize from "sequelize"
import { Produto, Usuario } from "../src/database/tables.mjs";
import attributeBuilder from "../src/utils/attributeBuilder.mjs";

console.log(attributeBuilder("(sum)preco,createdAt"))

console.log(
    await Produto.findAll({
        attributes: {
            include: [
                [sequelize.fn("AVG", sequelize.col("preco")), "nick"],
                [sequelize.col("createdAt"), "ct"]
            ],
        },

        group: ["ct"],
        raw: true
    })
)