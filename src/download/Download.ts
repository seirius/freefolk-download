import ytdl from "ytdl-core";
import { WriteStream } from "fs";
import { S3 } from 'aws-sdk';
import { S3Config } from "./S3Config";
import * as stream from 'stream';

export class Download {

    public static readonly S3 = new S3({ sslEnabled: true });

    public static download({videoUrl, writeStream}: IDownloadArgs): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const vid = ytdl(videoUrl);
            vid.pipe(writeStream);
            vid.on("response", (response) => response.on("end", resolve))
            .on("error", reject);
        });
    }

    public static async uploadS3({Body, Bucket, Key}: IUploadArgs): Promise<void> {
        await Download.S3.putObject({Body, Bucket, Key}).promise();
    }

    public static getPublicUrlS3({Bucket, Key, Expires}: IPublicUrlArgs): Promise<string> {
        return Download.S3.getSignedUrlPromise('getObject', { Bucket, Key, Expires });
    }

    public static async uploadVideoS3({video, filename}: IUploadVideoArgs): Promise<void> {
        await Download.uploadS3({
            Body: video,
            Bucket: S3Config.S3_BUCKET,
            Key: `video/${filename}`
        });
    }

    public static async downloadVideoS3({filename}: IDownloadVideoArgs): Promise<any> {
        return (await Download.S3.getObject({
            Bucket: S3Config.S3_BUCKET,
            Key: `video/${filename}`
        }).promise()).Body;
    }

    public static uploadMusicS3Stream(filename: string): {
        writeStream: WriteStream;
        promise: Promise<any>;
    } {
        const pass = new stream.PassThrough();
        return {
            writeStream: pass as any,
            promise: Download.S3.upload({
                Bucket: S3Config.S3_BUCKET,
                Key: `mp3/${filename}`,
                Body: pass
            }).promise()
        };
    }

}

export interface IDownloadArgs {
    videoUrl: string;
    writeStream: WriteStream;
}

export interface IUploadArgs {
    Body: any;
    Bucket: string;
    Key: string;
}

export interface IUploadVideoArgs {
    video: any;
    filename: string;
}

export interface IPublicUrlArgs {
    Bucket: string;
    Key: string;
    Expires: number;
}

export interface IDownloadVideoArgs {
    filename: string;
}