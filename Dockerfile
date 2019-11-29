FROM node:12.13.1-alpine AS build

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install && npm install -g typescript && tsc

EXPOSE 3000/tcp

ENTRYPOINT ["node", "lib/app.js"]
