FROM node:12.13.1-alpine AS build

WORKDIR /usr/src/app
RUN npm install -g @nestjs/cli
COPY ./package.json ./package-lock.json ./
RUN apk add --no-cache git
RUN npm install 
COPY ./nest-cli.json ./tsconfig.build.json ./tsconfig.json ./tslint.json ./
COPY ./src ./src
RUN nest build

FROM node:12.13.1-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
EXPOSE 3000/tcp
ENTRYPOINT ["node", "dist/main"]
