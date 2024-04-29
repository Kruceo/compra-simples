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
    freezeTableName: true,
    defaultScope: {
        attributes: { exclude: ['secreto'] }
    }
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
    },
    tipo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: "produtos",
    freezeTableName: true,
    name: {
        plural: "produtos",
        singular: "produto"
    }
})

const Transacao = dbserver.define("transacao", {
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
    valor: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    obs: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "transacoes",
    freezeTableName: true,
    name: {
        plural: "transacoes",
        singular: "transacao"
    }
})

const Transacao_item = dbserver.define("transacao_item", {
    id: _ID,
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Produto, key: "id" }
    },
    transacao_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Transacao, key: "id" }
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
    }
}, {
    tableName: "transacao_itens",
    freezeTableName: true,
    timestamps: false,
    name: {
        plural: "transacao_itens",
        singular: "transacao_item"
    }
})
await Produto.sync({ force: false })
await Usuario.sync({ force: false })
await Fornecedor.sync({ force: false })


await Bote.sync({ force: false })
await Transacao.sync({ force: false })
await Transacao_item.sync({ force: false })


/** Setup relations */

//cada esquerdo tem uma chave de fornecedor_id
Bote.belongsTo(Fornecedor, { foreignKey: 'fornecedor_id' })
//tem muitos do direito com uma chave de fornecedor_id
Fornecedor.hasMany(Bote, { foreignKey: 'fornecedor_id' })

Transacao_item.belongsTo(Transacao, { foreignKey: 'transacao_id' })
Transacao.hasMany(Transacao_item, { foreignKey: 'transacao_id' })

Transacao_item.belongsTo(Produto, { foreignKey: 'produto_id' })
Produto.hasMany(Transacao_item, { foreignKey: 'produto_id' })

// Entrada.belongsTo(Fornecedor, { foreignKey: "fornecedor_id" })
// Fornecedor.hasMany(Entrada, { foreignKey: 'fornecedor_id' })


Transacao.belongsTo(Bote, { foreignKey: "bote_id" })
Bote.hasMany(Transacao, { foreignKey: 'bote_id' })

Transacao.belongsTo(Usuario, { foreignKey: "usuario_id" })
Usuario.hasMany(Transacao, { foreignKey: 'usuario_id' })

// Sync relations

await Produto.sync({ alter: true })
await Usuario.sync({ alter: true })
await Bote.sync({ alter: true })
await Fornecedor.sync({ alter: true })
await Transacao.sync({ alter: true })
await Transacao_item.sync({ alter: true })

export default {
    Bote, Fornecedor, Produto, Transacao, Transacao_item, Usuario
}
export {
    Bote, Fornecedor, Produto, Transacao, Transacao_item, Usuario
}