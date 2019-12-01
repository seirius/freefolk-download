import Axios from "axios";
import { resolve as resolveUrl } from "url";
import { QueueConfig } from "../config/QueueConfig";
import { NOT_FOUND } from "http-status-codes";
import e = require("express");

export class Queue {

    public static async push({name, payload}: IPushArgs): Promise<void> {
        await Axios.post(resolveUrl(QueueConfig.HOST, "push"), {name, payload});
    }

    public static async npush({name, payload}: INPushArgs): Promise<void> {
        await Axios.post(resolveUrl(QueueConfig.HOST, "npush"), {name, payload});
    }

    public static async pop(name: string): Promise<Record<string, any>> {
        let response: any;
        try {
            response = await Axios.get(resolveUrl(QueueConfig.HOST, `pop/${name}`));
        } catch (error) {
            if (error.response.status === NOT_FOUND) {
                return;
            } else {
                throw error;
            }
        }
        return response.data;
    }

    public static async npop(name: string, number: number): Promise<IPopResponse> {
        let response: any;
        try {
            response = await Axios.get(resolveUrl(QueueConfig.HOST, `pop/${name}/${number}`));
        } catch (error) {
            if (error.response.status === NOT_FOUND) {
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