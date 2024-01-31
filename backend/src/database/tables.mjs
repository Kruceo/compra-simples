import { DataTypes } from "sequelize"
import dbserver from "./connection.mjs"

const _ID = {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
}

const Usuario = dbserver.define("usuario", {
    id: _ID,
    nome: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "usuarios",
    freezeTableName: true
})

const Fornecedor = dbserver.define("fornecedor", {
    id: _ID,
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    integracao_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "fornecedores",
    freezeTableName: true,
    name: {
        plural: "fornecedores",
        singular: "fornecedor"
    }
})

const Bote = dbserver.define("bote", {
    id: _ID,
    fornecedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Fornecedor, key: 'id' }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "botes",
    freezeTableName: true,
    name: {
        plural: "botes",
        singular: "bote"
    }
})

const Produto = dbserver.define("produto", {
    id: _ID,
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "produtos",
    freezeTableName: true,
    name: {
        plural: "produtos",
        singular: "produto"
    }
})

const Entrada = dbserver.define("entrada", {
    id: _ID,
    bote_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Bote, key: 'id' }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Usuario, key: 'id' }
    },
    valor_compra: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    peso_compra: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    valor_venda: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    peso_venda: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    obs: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "entradas",
    freezeTableName: true,
    name: {
        plural: "entradas",
        singular: "entrada"
    }
})

const Entrada_item = dbserver.define("entrada_item", {
    id: _ID,
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Produto, key: "id" }
    },
    entrada_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Entrada, key: "id" }
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    tipo: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: "entrada_items",
    freezeTableName: true,
    timestamps: false,
    name: {
        plural: "entrada_item",
        singular: "entrada_items"
    }
})
await Produto.sync({ force: false })
await Usuario.sync({ force: false })
await Bote.sync({ force: false })

await Fornecedor.sync({ force: false })
await Entrada.sync({ force: false })
await Entrada_item.sync({ force: false })


/** Setup relations */

//cada esquerdo tem uma chave de fornecedor_id
Bote.belongsTo(Fornecedor, { foreignKey: 'fornecedor_id' })
//tem muitos do direito com uma chave de fornecedor_id
Fornecedor.hasMany(Bote, { foreignKey: 'fornecedor_id' })

Entrada_item.belongsTo(Entrada, { foreignKey: 'entrada_id' })
Entrada.hasMany(Entrada_item, { foreignKey: 'entrada_id' })

Entrada_item.belongsTo(Produto, { foreignKey: 'produto_id' })
Produto.hasMany(Entrada_item, { foreignKey: 'produto_id' })

// Entrada.belongsTo(Fornecedor, { foreignKey: "fornecedor_id" })
// Fornecedor.hasMany(Entrada, { foreignKey: 'fornecedor_id' })


Entrada.belongsTo(Bote, { foreignKey: "bote_id" })
Bote.hasMany(Entrada, { foreignKey:   'bote_id' })

Entrada.belongsTo(Usuario, { foreignKey: "usuario_id" })
Usuario.hasMany(Entrada, { foreignKey: 'usuario_id' })

// Sync relations

// await Produto.sync({ alter: true })
// await Usuario.sync({ alter: true })
// await Bote.sync({ alter: true })
// await Fornecedor.sync({ alter: true })
// await Entrada.sync({ alter: true })
// await Entrada_item.sync({ alter: true })

export default {
    Bote, Fornecedor, Produto, Entrada, Entrada_item, Usuario
}
export {
    Bote, Fornecedor, Produto, Entrada, Entrada_item, Usuario
}