FROM nginx:1.25.4

RUN apt update && apt install nodejs -y && apt install npm -y

WORKDIR /frontend
COPY ./package.json           ./package.json
RUN npm i

ENV DOMAIN=localhost

COPY ./src                    ./src
COPY ./public                 ./public

COPY ./tailwind.config.js     ./tailwind.config.js
COPY ./postcss.config.js      ./postcss.config.js
COPY ./tsconfig.json          ./tsconfig.json
COPY ./tsconfig.node.json     ./tsconfig.node.json
COPY ./vite.config.ts         ./vite.config.ts
COPY ./index.html             ./index.html

ENV API_ADDRESS=localhost
ENV API_PROTOCOL=http
ENV API_PORT=8080

ENV PRINTER_ADDRESS=localhost
ENV PRINTER_PROTOCOL=http
ENV PRINTER_PORT=8888  

COPY ./scripts/configureContainer.mjs ./configure.mjs

RUN echo "node configure.mjs"     > start.sh && \
    echo "nginx -g 'daemon off;'"    >> start.sh

RUN chmod +x start.sh

RUN rm /etc/nginx/conf.d/default.conf

ENV PROD=true

CMD [ "./start.sh" ]
# CMD ["nginx", "-g", "daemon off;"]