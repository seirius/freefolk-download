FROM node:12.13.1-alpine AS build

RUN npm install -g @nestjs/cli

FROM build

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./
RUN npm install 

COPY ./nest-cli.json ./tsconfig.build.json ./tsconfig.json ./tslint.json ./
COPY ./src ./src
RUN nest build

EXPOSE 3000/tcp

ENTRYPOINT ["node", "dist/main"]
