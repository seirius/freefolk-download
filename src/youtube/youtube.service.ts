import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import Axios from 'axios';
import { YoutubeConfig } from "./../config/YoutubeConfig";

@Injectable()
export class YoutubeService {

    public async list({ids}: IYoutubeListArgs): Promise<IVideoItem[]> {
        const { YOUTUBE_ENDPOINT_HOST, YOUTUBE_ENDPOINT_LIST } = YoutubeConfig;
        const response = await Axios.get(`${YOUTUBE_ENDPOINT_HOST}/${YOUTUBE_ENDPOINT_LIST}`, {
            params: {id: ids},
        });
        if (response.status !== HttpStatus.OK) {
            throw new HttpException(response.statusText, response.status);
        }
        return response.data.videos;
    }

    public async entirePlaylist(id: string): Promise<IVideoItem[]> {
        const response = await Axios.get(`${YoutubeConfig.YOUTUBE_ENDPOINT_HOST}/entire-playlist`, {
            params: {id},
        });
        if (response.status !== HttpStatus.OK) {
            throw new HttpException(response.statusText, response.status);
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