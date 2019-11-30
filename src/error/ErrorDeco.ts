import { Request, Response } from "express-serve-static-core";
import { Logger } from "@overnightjs/logger";
import { INTERNAL_SERVER_ERROR, getStatusText } from "http-status-codes";
import { HttpError } from "./HttpError";

export function Catch(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req: Request, res: Response): Promise<any> {
        try {
            return await Reflect.apply(originalMethod, this, [req, res]);
        } catch (error) {
            Logger.Err(error, true);
            let status = INTERNAL_SERVER_ERROR;
            if (error instanceof HttpError) {
                status = error.statusCode;
            }
            res.status(status).json({errorMessage: getStatusText(status)})
        }
    };
    return descriptor;
}