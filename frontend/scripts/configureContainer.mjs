#!/bin/node

import fs from "fs"
import cp from "child_process"

const nginxConfig = `\
server {                                         
    listen 80;                                    
    server_name ${process.env.DOMAIN};                        
    root /var/www;                                
    index index.html;                             
                                                  
    location / {                                  
       try_files $uri $uri/ /index.html;          
    }                                             
}`
if (process.env.PROD)
    fs.writeFileSync("/etc/nginx/conf.d/react-app.conf", nginxConfig)

let config = {
    "api_address": process.env.API_ADDRESS,
    "api_protocol": process.env.API_PROTOCOL,
    "api_port": process.env.API_PORT,
    "printer": {
        "address": process.env.PRINTER_ADDRESS,
        "protocol": process.env.PRINTER_PROTOCOL,
        "port": process.env.PRINTER_PORT
    }
}

fs.writeFileSync("config.json", JSON.stringify(config, null, 2))
console.log("Configuration created.")

if (fs.existsSync("/var/www/assets")) process.exit()

if (!fs.existsSync("./dist/assets")) {
    console.log("dist not exists")
    cp.execSync("npm run build", { stdio: "inherit" })
}

if (!fs.existsSync("/var/www"))
    fs.mkdirSync("/var/www", { recursive: true })

if (!fs.existsSync("/var/www/assets"))
    cp.execSync("cp -r ./dist/* /var/www/", { stdio: "inherit" })

