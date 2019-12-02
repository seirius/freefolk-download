import ytdl from "ytdl-core";
import { WriteStream } from "fs";
import { CronJob } from "cron";
import { BatchConfig } from "../config/BatchConfig";
import { WorkerManager } from "./WorkerManager";
import { Queue } from "../queue/Queue";
import { Logger } from "@overnightjs/logger";
import { PassThrough } from "stream";
import { FileManager } from "../filemanager/FileManager";
import { Converter } from "../converter/Converter";
import { QueueConfig } from "../config/QueueConfig";

export class Download {

    public static workerManager: WorkerManager;

    public static download({videoUrl, writeStream}: IDownloadArgs): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const vid = ytdl(videoUrl);
            vid.pipe(writeStream);
            vid.on("response", (response) => response.on("end", resolve))
            .on("error", reject);
        });
    }

    public static async startCron(): Promise<void> {
        if (!QueueConfig.HOST) {
            Logger.Info("Queue's HOST not defined, cron will be disabled");
            return;
        }
        Download.workerManager = new WorkerManager(BatchConfig.PARALLEL_NUMBER);
        let cronWorking = false;
        new CronJob(BatchConfig.CRON_INTERVAL, async () => {
            if (cronWorking) {
                return;
            }
            try {
                const freeWorkers = Download.workerManager.getFreeWorkers();
                if (freeWorkers.length) {
                    const response = await Queue.npop("youtube", freeWorkers.length);
                    if (response && response.payload.length) {
                        response.payload.forEach((payload, index) => {
                            try{
                                freeWorkers[index].run(async () => {
                                    const {filename, tags, id, type, videoUrl} = payload;
                                    const read = new PassThrough();
                                    let promise: Promise<void>;
                                    if (type === "mp4") {
                                            promise = FileManager.upload({
                                                id, tags, file: read as any, filename
                                            });
                                    } else if (type === "mp3") {
                                        const {title} = payload;
                                        promise = Converter.convert({
                                            id, tags, file: read as any, filename: title, from: "mp4", format: "mp3"
                                        });
                                    } else {
                                        throw new Error("Invalid payload type (Download -> Queue treatment)");
                                    }
                                    const write = new PassThrough();
                                    write.pipe(read);
                                    await Download.download({
                                        videoUrl: videoUrl,
                                        writeStream: write as any
                                    });
                                    await promise;
                                });
                            } catch(err) {
                                Logger.Err(err, true);
                            }
                        });
                    }
                }
            } catch(error) {
                Logger.Err(error, true);
            } finally {
                cronWorking = false;
            }
        }, null, true, BatchConfig.CRON_TIMEZONE);
    }

}

export interface IDownloadArgs {
    videoUrl: string;
    writeStream: WriteStream;
}