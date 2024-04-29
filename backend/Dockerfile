FROM node:21-alpine
WORKDIR /backend
COPY config config
COPY src src
COPY tools tools

COPY index.mjs index.mjs
COPY package.json package.json
COPY package-lock.json package-lock.json

COPY tools/genConfigFile.mjs genConfigFile.mjs

ENV  DB_USERNAME=postgres
ENV  DB_PASSWORD=admin
ENV      DB_PORT=5432
ENV    DB_SCHEMA=principal
ENV      DB_HOST=localhost
ENV   DB_DIALECT=postgres

ENV CORS_ORIGIN=localhost

ENV SECRET=2crows

RUN npm i

RUN echo "node genConfigFile.mjs \$DB_USERNAME \$DB_PASSWORD \$DB_SCHEMA \$DB_PORT \$DB_HOST \$DB_DIALECT \$CORS_ORIGIN \$SECRET ./config/config.json" > start.sh
RUN echo "node index.mjs" >> start.sh
RUN chmod +x start.sh

EXPOSE 8080

CMD [ "./start.sh", ]