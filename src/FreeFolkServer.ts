import { Server } from '@overnightjs/core';
import { json, urlencoded } from 'body-parser';
import { ServerConfig } from './config/ServerConfig';
import { Logger } from '@overnightjs/logger';
import { DefaultController } from './default/DefaultController';

export class FreeFolkServer extends Server {

    constructor() {
        super(true);
    }

    public async start(): Promise<void> {
        this.app.use(json());
        this.app.use(urlencoded({extended: true}));
        this.addControllers([
            new DefaultController(),
        ]);
        this.app.listen(
            ServerConfig.PORT, 
            () => Logger.Info(`Server listenning at http://localhost:${ServerConfig.PORT}`, true)
        );
    }

}