import { Injectable, HttpStatus } from "@nestjs/common";
import Axios from "axios";
import { resolve as resolveUrl } from "url";
import { QueueConfig } from "./../config/QueueConfig";

@Injectable()
export class QueueService {
    public async push({name, payload}: IPushArgs): Promise<void> {
        await Axios.post(resolveUrl(QueueConfig.HOST, "push"), {name, payload});
    }

    public async npush({name, payload}: INPushArgs): Promise<void> {
        await Axios.post(resolveUrl(QueueConfig.HOST, "npush"), {name, payload});
    }

    public async pop(name: string): Promise<Record<string, any>> {
        let response: any;
        try {
            response = await Axios.get(resolveUrl(QueueConfig.HOST, `pop/${name}`));
        } catch (error) {
            if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
                return;
            } else {
                throw error;
            }
        }
        return response.data;
    }

    public async npop(name: string, number: number): Promise<IPopResponse> {
        let response: any;
        try {
            response = await Axios.get(resolveUrl(QueueConfig.HOST, `pop/${name}/${number}`));
        } catch (error) {
            if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
                return;
            } else {
                throw error;
            }
        }
        return response.data;
    }
}

export interface IPushArgs {
    name: string;
    payload: Record<string, any>;
}

export interface INPushArgs {
    name: string;
    payload: Record<string, any>[];
}

export interface IPopResponse {
    payload: Record<string, any>[];
}