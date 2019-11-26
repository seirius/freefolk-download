import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export class HttpError extends Error {
    public statusCode: number;

    constructor(msg: string, statusCode = INTERNAL_SERVER_ERROR) {
        super(msg);
        this.statusCode = statusCode;
    }
}