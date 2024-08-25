FROM node:22-alpine3.19

RUN npm install nodemon -g
COPY ./package.json ./
RUN npm install

WORKDIR /app
COPY ./app ./


EXPOSE 3000


ENTRYPOINT [ "npm", "run", "start" ]
