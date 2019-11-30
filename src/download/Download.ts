import ytdl from "ytdl-core";
import { WriteStream } from "fs";

export class Download {

    public static download({videoUrl, writeStream}: IDownloadArgs): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const vid = ytdl(videoUrl);
            vid.pipe(writeStream);
            vid.on("response", (response) => response.on("end", resolve))
            .on("error", reject);
        });
    }

}

export interface IDownloadArgs {
    videoUrl: string;
    writeStream: WriteStream;
}