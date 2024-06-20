import fs from 'fs'
const [, , db_username, db_password, db_schema, db_port, db_host, db_dialect, cors_origin, cors_sameFromRequest, secret, tokenExpireTime, testmode, output] = process.argv

if (!db_username, !db_password, !db_schema, !db_port, !db_host, !db_dialect, !cors_origin, !cors_sameFromRequest, !secret, !tokenExpireTime, !testmode, !output) {
    console.error("use args 'db_username' 'db_password' 'db_schema' 'db_host' 'db_dialect' 'cors_origin' 'cors_sameFromRequest' 'secret' 'testmode' 'output'")
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
            "credentials": true,
            "sameFromRequest": cors_sameFromRequest == "true"
        }
    },
    "security": {
        "jwt": {
            "secret": secret,
            "tokenExpireTime": tokenExpireTime
        },
        "prefixLength": 6,
        "sufixLength": 10
    },
    "test": testmode == "true"
}

fs.writeFileSync(output, JSON.stringify(f))