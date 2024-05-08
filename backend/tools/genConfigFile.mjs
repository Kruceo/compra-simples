import fs from 'fs'
const [, , db_username, db_password, db_schema, db_port, db_host, db_dialect, cors_origin, secret, output] = process.argv

if (!db_username, !db_password, !db_schema, !db_port, !db_host, !db_dialect, !cors_origin, !secret, !output) {
    console.error("use args 'db_username' 'db_password' 'db_schema' 'db_host' 'db_dialect' 'cors_origin' 'secret' 'output'")
    process.exit()
}

const f = {
    "database": {
        "username": db_username,
        "password": db_password,
        "schema": db_schema,
        "port": db_port,
        "host": db_host,
        "dialect": db_dialect
    },
    "server": {
        "port": 8080,
        "cors": {
            "origin": cors_origin.split(","),
            "credentials": true
        }
    },
    "security": {
        "jwt": {
            "secret": secret,
            "tokenExpireTime": "24h"
        },
        "prefixLength": 6,
        "sufixLength": 10
    }
}

fs.writeFileSync(output, JSON.stringify(f))