import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from 'http-status-codes';
import { Catch } from "../error/ErrorDeco";

@Controller('')
export class DefaultController {

    @Get("ping")
    @Catch
    public ping(_req: Request, res: Response): void {
        res.status(OK).send("pong");
    }

}