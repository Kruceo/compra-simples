import Sequelize from 'sequelize';
import cfg from "../../config/config.json" assert { type: "json" }

/**
 * @type {import('sequelize').Sequelize}
 */
const dbserver = new Sequelize({
    // database: cfg.database.database,
    schema:   cfg.database.schema,
    host:     cfg.database.host,
    password: cfg.database.password,
    username: cfg.database.username,
    dialect:  cfg.database.dialect,
    logging:  true
});

export default dbserver