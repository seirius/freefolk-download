import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from 'http-status-codes';
import { Catch } from "../error/ErrorDeco";

@Controller('')
export class DefaultController {

    /**
     * @swagger
     * /ping:
     *  get:
     *      tags:
     *          - default
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: "pong"
     */
    @Get("ping")
    @Catch
    public ping(_req: Request, res: Response): void {
        res.status(OK).send("pong");
    }

}