import { Injectable, Logger } from "@nestjs/common";
import { WorkerManagerService } from "./worker-manager.service";
import { QueueConfig } from "./../config/QueueConfig";
import ytdl from "ytdl-core";
import { WriteStream } from "fs";
import { BatchConfig } from "./../config/BatchConfig";
import { CronJob } from "cron";
import { QueueService } from "./../queue/queue.service";
import { PassThrough } from "stream";
import { FileManagerService } from "./../filemanager/filemanager.service";
import { ConverterService } from "./../converter/converter.service";
import { MqttService } from "nest-mqtt-client";

@Injectable()
export class DownloadService {

    private readonly logger = new Logger(DownloadService.name);

    constructor(
        private readonly workerManager: WorkerManagerService,
        private readonly queueService: QueueService,
        private readonly fileManagerService: FileManagerService,
        private readonly converterService: ConverterService,
        private readonly mqttService: MqttService,
    ) {
        this.startCron();
    }

    public download({videoUrl, writeStream, id, onProgress}: IDownloadArgs): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const vid = ytdl(videoUrl);
            vid.pipe(writeStream);
            vid.on("response", (response) => response.on("end", resolve));
            vid.on("progress", (chunk: number, downloaded: number, total: number) => {
                if (onProgress) {
                    onProgress(downloaded / total * 100);
                }
            })
            .on("error", reject);
        });
    }

    public async startCron(): Promise<void> {
        if (!QueueConfig.HOST) {
            this.logger.log("Queue's HOST not defined, cron will be disabled");
            return;
        }
        let cronWorking = false;
        // tslint:disable-next-line: no-unused-expression
        new CronJob(BatchConfig.CRON_INTERVAL, async () => {
            if (cronWorking) {
                return;
            }
            try {
                const freeWorkers = this.workerManager.getFreeWorkers();
                if (freeWorkers.length) {
                    const response = await this.queueService.npop("youtube", freeWorkers.length);
                    if (response && response.payload.length) {
                        response.payload.forEach((payload, index) => {
                            try {
                                freeWorkers[index].run(async () => {
                                    const {filename, tags, id, type, videoUrl, title, author} = payload;
                                    this.mqttService.push({
                                        channel: "download",
                                        payload: {
                                            id,
                                            state: "init",
                                            type,
                                        },
                                    });
                                    const read = new PassThrough();
                                    let promise: Promise<void>;
                                    if (type === "mp4") {
                                        promise = this.fileManagerService.upload({
                                            id, tags, file: read as any, filename,
                                        });
                                    } else if (type === "mp3") {
                                        const {thumbnailUrl} = payload;
                                        promise = this.converterService.convertMp3Mp4({
                                            id, tags, file: read as any,
                                            filename: title, imageUrl: thumbnailUrl,
                                            metadata: {
                                                title,
                                                artist: author,
                                            },
                                        });
                                        promise.then(() => {
                                            this.mqttService.push({
                                                channel: "convert",
                                                payload: {
                                                    id,
                                                    state: "done",
                                                    type,
                                                },
                                            });
                                        });
                                    } else {
                                        throw new Error("Invalid payload type (Download -> Queue treatment)");
                                    }
                                    const write = new PassThrough();
                                    write.pipe(read);
                                    await this.download({
                                        videoUrl,
                                        writeStream: write as any,
                                        id,
                                        onProgress: (progress) => {
                                            this.mqttService.push({
                                                channel: "download",
                                                payload: {
                                                    id,
                                                    state: "progress",
                                                    progress,
                                                    type,
                                                },
                                            });
                                        },
                                    });
                                    this.mqttService.push({
                                        channel: "download",
                                        payload: {
                                            id,
                                            state: "done",
                                            type,
                                        },
                                    });
                                    await promise;
                                });
                            } catch (err) {
                                this.logger.error(err);
                            }
                        });
                    }
                }
            } catch (error) {
                this.logger.error(error);
            } finally {
                cronWorking = false;
            }
        }, null, true, BatchConfig.CRON_TIMEZONE);
    }

}

export interface IDownloadArgs {
    id: string;
    videoUrl: string;
    writeStream: WriteStream;
    onProgress?: (progress: number) => void;
}
