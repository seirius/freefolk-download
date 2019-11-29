import * as env from 'env-var';
import { config as envConfig } from 'dotenv';

envConfig();

export class YoutubeConfig {
    public static readonly YOUTUBE_HOST = env.get("YOUTUBE_HOST", "https://www.youtube.com/watch").asString();
    public static readonly YOUTUBE_ENDPOINT_HOST = env.get("YOUTUBE_ENDPOINT_HOST", "http://localhost:3000").asString();
    public static readonly YOUTUBE_ENDPOINT_LIST = env.get("YOUTUBE_ENDPOINT_LIST", "list").asString();
}