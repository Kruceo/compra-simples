FROM nginx:1.25.4

ENV DOMAIN=localhost

RUN echo 'server {'                            > /etc/nginx/conf.d/react-app.conf && \
    echo '    listen 8080;'                    >> /etc/nginx/conf.d/react-app.conf && \
    echo '    server_name ${DOMAIN};'          >> /etc/nginx/conf.d/react-app.conf && \
    echo '    root /var/www;'                  >> /etc/nginx/conf.d/react-app.conf && \
    echo '    index index.html;'               >> /etc/nginx/conf.d/react-app.conf && \
    echo ''                                    >> /etc/nginx/conf.d/react-app.conf && \
    echo '    location / {'                    >> /etc/nginx/conf.d/react-app.conf && \
    echo '       try_files $uri $uri/ /index.html; ' >> /etc/nginx/conf.d/react-app.conf && \
    echo '    }'                                               >> /etc/nginx/conf.d/react-app.conf && \
    echo ''                                                    >> /etc/nginx/conf.d/react-app.conf && \
    echo '    # Outras configurações, como SSL, cache, etc.'   >> /etc/nginx/conf.d/react-app.conf && \
    echo '}'                                                   >> /etc/nginx/conf.d/react-app.conf

RUN apt update && apt install nodejs -y && apt install npm -y

WORKDIR /frontend

COPY ./src                    ./src
COPY ./public                 ./public
COPY ./package.json           ./package.json
COPY ./tailwind.config.js     ./tailwind.config.js
COPY ./postcss.config.js      ./postcss.config.js
COPY ./tsconfig.json          ./tsconfig.json
COPY ./tsconfig.node.json     ./tsconfig.node.json
COPY ./vite.config.ts         ./vite.config.ts
COPY ./index.html             ./index.html

RUN npm i

RUN npm run build

RUN mkdir /var/www

RUN rm /etc/nginx/conf.d/default.conf

RUN cp -r /frontend/dist/* /var/www/