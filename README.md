## Server config
| Name  | Default  | Description  |
|---|---|---|
| PORT  | 3000  | Http server port  |
---

## Batch config
| Name  | Default  | Description  |
|---|---|---|
| CRON_INTERVAL  | */5 * * * * *  | Queue check timer  |
| PARALLEL_NUMBER  | 5  | Number of processes  |
| CRON_TIMEZONE  | Europe/Madrid  | Cron timezone  |
---

## Converter config
| Name  | Default  | Description  |
|---|---|---|
| CONVERTER_HOST  |  | Converter http address  |
---

## Filemanager config
| Name  | Default  | Description  |
|---|---|---|
| FILE_MANAGER_HOST  |  | Filemanager http address  |
---

## Queue config
| Name  | Default  | Description  |
|---|---|---|
| QUEUE_HOST  |  | Queue http address  |
---

## Queue config
| Name  | Default  | Description  |
|---|---|---|
| YOUTUBE_HOST  |  | Youtube url address (real)  |
| YOUTUBE_ENDPOINT_HOST  |  | Youtube http address  |
| YOUTUBE_ENDPOINT_LIST  |  | Path to the list endpoint  |
---

## Mqtt config
| Name  | Default  | Description  |
|---|---|---|
| MQTT_HOST  |  mqtt://localhost  | Mqtt host address |
---


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
