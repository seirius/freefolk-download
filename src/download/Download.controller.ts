import { Controller, Post, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { Download } from "./Download";
import { Catch } from "../error/ErrorDeco";
import { Youtube } from "../youtube/Youtube";
import { OK } from "http-status-codes";
import { Logger } from "@overnightjs/logger";
import { lookup } from "mime-types";
import { PassThrough } from "stream";
import { FileManager } from "../filemanager/FileManager";
import { Converter } from "../converter/Converter";

@Controller("")
export class DownloadController {

    @Post("download")
    @Catch
    public async download(req: Request, res: Response): Promise<void> {
        const { id } = req.body;
        const [video] = await Youtube.list({ids: [id]});
        const filename = Youtube.safeFilename(video.title) + ".mp4";
        res.setHeader("Content-disposition", "attachment; filename=" + filename);
        res.setHeader("x-suggested-filename", filename);
        res.setHeader("content-type", lookup(filename) || "application/octet-stream");
        await Download.download({
            videoUrl: video.videoUrl,
            writeStream: res as any
        });
        res.end();
    }

    @Get("start-download/:id")
    @Catch
    public async startDownload(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const [video] = await Youtube.list({ids: [id]});
        const filename = `${video.title}.mp4`;
        res.status(OK).json({filename});
        try {
            const read = new PassThrough();
            const promise = FileManager.upload({
                id, tags: ["mp4"], file: read as any, filename
            });
            const write = new PassThrough();
            write.pipe(read);
            await Download.download({
                videoUrl: video.videoUrl,
                writeStream: write as any
            });
            await promise;
        } catch(error) {
            Logger.Err(error, true);
        }
    }

    @Get("start-download/audio/:id")
    @Catch
    public async startDownloadAudio(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const [video] = await Youtube.list({ids: [id]});
        const filename = `${video.title}.mp3`;
        res.status(OK).json({filename});
        try {
            const read = new PassThrough();
            const promise = Converter.convert({
                id, tags: ["mp3"], file: read as any, filename: video.title, from: "mp4", format: "mp3"
            });
            const write = new PassThrough();
            write.pipe(read);
            await Download.download({
                videoUrl: video.videoUrl,
                writeStream: write as any
            });
            await promise;
        } catch(error) {
            Logger.Err(error, true);
        }
    }

}