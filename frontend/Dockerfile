FROM node:21.4.0

RUN apt update
RUN apt install git -y

RUN apt install nginx -y

WORKDIR /easyfish/frontend
ENV DOMAIN=localhost

# Downloads only package.json and install dependencies first
RUN curl https://raw.githubusercontent.com/Kruceo/easyfish/main/frontend/package.json -o package.json
RUN curl https://raw.githubusercontent.com/Kruceo/easyfish/main/frontend/package-lock.json -o package-lock.json
RUN npm i
RUN rm package.json
RUN rm package-lock.json

# Clone just the "frontend" of github repo
LABEL random="0"
WORKDIR /easyfish
RUN git init
RUN git branch -m main
RUN git remote add -f origin https://github.com/Kruceo/easyfish.git
RUN git config core.sparseCheckout true
RUN echo "frontend" >> .git/info/sparse-checkout
RUN git pull origin main

# Return to frontend folder
WORKDIR /easyfish/frontend

# Configure default envs
ENV API_ADDRESS=localhost
ENV API_PROTOCOL=http
ENV API_PORT=8080

ENV PRINTER_ADDRESS=localhost
ENV PRINTER_PROTOCOL=http
ENV PRINTER_PORT=8888  
# ENV DASHBOARD_CUSTOM_PAGE="https://kruceo.com"

# Configure the frontend entrypoint
RUN echo "node ./scripts/configureDockerContainer.mjs"     > start.sh && \
    echo "nginx -g 'daemon off;'"                          >> start.sh

RUN chmod +x start.sh

RUN rm /etc/nginx/sites-enabled/*

ENV PROD=true

CMD [ "./start.sh" ]
# CMD ["nginx", "-g", "daemon off;"]