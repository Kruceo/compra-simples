#!/bin/node

import fs from "fs"
import cp from "child_process"
const WWW_PATH = "/var/www/app/"

const nginxConfig = `\
server {                        
    listen 80 default_server;                 
    listen [::]:80 default_server;                                    
    server_name ${process.env.DOMAIN};                        
    root ${WWW_PATH};                                
    index index.html;                             
                                                  
    location / {                                  
       try_files $uri $uri/ /index.html;          
    }                                             
}`

const prod = process.env.PROD ? true : false

if (prod) {
    fs.writeFileSync(`/etc/nginx/conf.d/app.conf`, nginxConfig)
}

let config = {
    "api_address": process.env.API_ADDRESS,
    "api_protocol": process.env.API_PROTOCOL,
    "api_port": process.env.API_PORT,
    "printer": {
        "address": process.env.PRINTER_ADDRESS,
        "protocol": process.env.PRINTER_PROTOCOL,
        "port": process.env.PRINTER_PORT
    },
    "dashboard_custom_page": process.env.DASHBOARD_CUSTOM_PAGE ?? null
}

fs.writeFileSync("config.json", JSON.stringify(config, null, 2))
console.log("Configuration created.")

if (!prod) {
    console.log(config)
}

if (fs.existsSync(WWW_PATH + "assets")) process.exit()

if (!fs.existsSync("./dist/assets")) {
    console.log("dist not exists")
    cp.execSync("npm run build", { stdio: "inherit" })
}

if (!prod) process.exit()

if (!fs.existsSync(WWW_PATH))
    fs.mkdirSync(WWW_PATH, { recursive: true })

if (!fs.existsSync(WWW_PATH + "assets"))
    cp.execSync(`cp -r ./dist/* ${WWW_PATH}`, { stdio: "inherit" })

