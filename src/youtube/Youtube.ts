import axios from 'axios';
import { YoutubeConfig } from './YoutubeConfig';
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

    public static safeFilename(oFilaname: string): string {
        return oFilaname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
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
}