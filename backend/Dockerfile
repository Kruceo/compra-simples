FROM node:21-alpine

RUN apk add git

# Clone just the "backend" of github repo
LABEL random="0"
WORKDIR /easyfish
RUN git init
RUN git branch -m main
RUN git remote add -f origin https://github.com/Kruceo/easyfish.git
RUN git config core.sparseCheckout true
RUN echo "backend" >> .git/info/sparse-checkout
RUN git pull origin main

RUN apk del git

WORKDIR /easyfish/backend

ENV  DB_USERNAME=postgres
ENV  DB_PASSWORD=admin
ENV      DB_PORT=5432
ENV    DB_SCHEMA=principal
ENV      DB_HOST=localhost
ENV   DB_DIALECT=postgres

ENV CORS_ORIGIN=localhost

ENV SECRET=2crows

ENV TEST=false

ENV TOKEN_EXPIRE_TIME=24h

ENV TESTMODE=0

RUN npm i

RUN echo "node ./tools/genConfigFile.mjs \$DB_USERNAME \$DB_PASSWORD \$DB_SCHEMA \$DB_PORT \$DB_HOST \$DB_DIALECT \$CORS_ORIGIN \$SECRET \$TOKEN_EXPIRE_TIME \$TESTMODE ./config/config.json" > start.sh
RUN echo "node index.mjs" >> start.sh
RUN chmod +x start.sh

EXPOSE 8080

CMD [ "./start.sh", ]