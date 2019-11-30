import { Server } from '@overnightjs/core';
import { json, urlencoded } from 'body-parser';
import { ServerConfig } from './config/ServerConfig';
import { Logger } from '@overnightjs/logger';
import { DefaultController } from './default/Default.controller';
import swagger from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { DownloadController } from './download/Download.controller';

export class FreeFolkServer extends Server {

    constructor() {
        super(true);
    }

    public async start(): Promise<void> {
        const specs = swagger({
            apis: ['**/*.controller.*'],
            swaggerDefinition: {
                info: {
                    description: 'Theater API',
                    title: 'Movie theater',
                    version: '1.0.0',
                },
            },
        });
        this.app.use(json());
        this.app.use(urlencoded({extended: true}));
        this.addControllers([
            new DefaultController(),
            new DownloadController(),
        ]);
        this.app.use(
            '/swagger',
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
        this.app.listen(
            ServerConfig.PORT, 
            () => {
                Logger.Info(`Server listenning at http://localhost:${ServerConfig.PORT}`, true);
                Logger.Info(`Swagger at http://localhost:${ServerConfig.PORT}/swagger`, true);
            }
        );
    }

}