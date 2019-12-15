FROM node:12.13.1-alpine AS build

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install && npm install -g @nestjs/cli && nest build

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "run", "start:prod"]
