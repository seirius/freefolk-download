import axios from 'axios';
import { YoutubeConfig } from '../config/YoutubeConfig';
import { OK } from 'http-status-codes';
import { HttpError } from '../error/HttpError';

export class Youtube {

    public static async list({ids}: IYoutubeListArgs): Promise<IVideoItem[]> {
        const { YOUTUBE_ENDPOINT_HOST, YOUTUBE_ENDPOINT_LIST } = YoutubeConfig;
        const response = await axios.post(`${YOUTUBE_ENDPOINT_HOST}/${YOUTUBE_ENDPOINT_LIST}`, {ids});
        if (response.status !== OK) {
            throw new HttpError(response.statusText, response.status);
        }
        return response.data.videos;
    }

    public static async entirePlaylist(id: string): Promise<IVideoItem[]> {
        const response = await axios.post(`${YoutubeConfig.YOUTUBE_ENDPOINT_HOST}/entire-playlist`, {id});
        if (response.status !== OK) {
            throw new HttpError(response.statusText, response.status);
        }
        return response.data.videos;
    }

}

export interface IYoutubeListArgs {
    ids: string[];
}

export interface IVideoItem {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    disabled: boolean;
    author: string;
}