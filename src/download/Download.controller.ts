import { Controller, Post, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { Download } from "./Download";
import { Catch } from "../error/ErrorDeco";
import { Youtube } from "../youtube/Youtube";
import { OK, BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import { Logger } from "@overnightjs/logger";
import { lookup } from "mime-types";
import { PassThrough } from "stream";
import { FileManager } from "../filemanager/FileManager";
import { Converter } from "../converter/Converter";
import { HttpError } from '../error/HttpError';
import { Queue } from "../queue/Queue";

@Controller("")
export class DownloadController {

    /**
     * @swagger
     * /download/{id}:
     *  get:
     *      tags:
     *          - download
     *      parameters:
     *          - in: path
     *            required: true
     *            name: id
     *            type: string
     *      responses:
     *          200:
     *              description: ok
     *              content:
     *                  video/mp4:
     *                      schema:
     *                          type: string
     *                          format: binary
     */
    @Get("download/:id")
    @Catch
    public async download(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const [video] = await Youtube.list({ids: [id]});
        const filename = `${video.title}.mp4`;
        res.setHeader("Content-disposition", "attachment; filename=" + filename);
        res.setHeader("x-suggested-filename", filename);
        res.setHeader("content-type", lookup(filename) || "application/octet-stream");
        await Download.download({
            videoUrl: video.videoUrl,
            writeStream: res as any
        });
        res.end();
    }

    /**
     * @swagger
     * /start-download/{id}:
     *  get:
     *      tags:
     *          - download
     *      parameters:
     *          - in: path
     *            required: true
     *            name: id
     *            type: string
     *      responses:
     *          200:
     *              description: ok
     */
    @Get("start-download/:id")
    @Catch
    public async startDownload(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const [video] = await Youtube.list({ids: [id]});
        if (!video) {
            throw new HttpError("Video not found", BAD_REQUEST);
        }
        const filename = `${video.title}.mp4`;
        await Queue.push({
            name: "youtube",
            payload: {
                filename,
                tags: ["mp4"],
                id,
                type: "mp4",
                videoUrl: video.videoUrl
            }
        });
        res.status(OK).json({filename});
    }

    /**
     * @swagger
     * /start-download:
     *  post:
     *      tags:
     *          - download
     *      parameters:
     *          - in: body
     *            required: true
     *            name: args
     *            schema:
     *              type: object
     *              required:
     *                  - ids
     *              properties:
     *                  ids:
     *                      type: array
     *                      items:
     *                          type: string
     *      responses:
     *          200:
     *              description: ok
     *              schema:
     *                  type: object
     *                  properties:
     *                      filename:
     *                          type: array
     *                          items:
     *                              type: string
     */
    @Post("start-download")
    @Catch
    public async multipleStartDownload(req: Request, res: Response): Promise<void> {
        const { ids } = req.body;
        const videos = await Youtube.list({ids});
        if (!videos.length) {
            throw new HttpError("Videos not found", NOT_FOUND);
        }
        const payload = videos.map(video => {
            return {
                filename: `${video.title}.mp4`,
                tags: ["mp4"],
                id: video.id,
                type: "mp4",
                videoUrl: video.videoUrl
            };
        });
        await Queue.npush({
            name: "youtube",
            payload
        });
        res.status(OK).json({filename: payload.map((p) => p.filename)});
    }

    /**
     * @swagger
     * /start-download/audio/{id}:
     *  get:
     *      tags:
     *          - download
     *      parameters:
     *          - in: path
     *            required: true
     *            name: id
     *            type: string
     *      responses:
     *          200:
     *              description: ok
     */
    @Get("start-download/audio/:id")
    @Catch
    public async startDownloadAudio(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const [video] = await Youtube.list({ids: [id]});
        if (!video) {
            throw new HttpError("Video not found", BAD_REQUEST);
        }
        const filename = `${video.title}.mp3`;
        await Queue.push({
            name: "youtube",
            payload: {
                filename,
                tags: ["mp3"],
                id,
                type: "mp3",
                videoUrl: video.videoUrl,
                title: video.title,
            }
        });
        res.status(OK).json({filename});
    }

    /**
     * @swagger
     * /start-download/audio:
     *  post:
     *      tags:
     *          - download
     *      parameters:
     *          - in: body
     *            required: true
     *            name: args
     *            schema:
     *              type: object
     *              required:
     *                  - ids
     *              properties:
     *                  ids:
     *                      type: array
     *                      items:
     *                          type: string
     *      responses:
     *          200:
     *              description: ok
     *              schema:
     *                  type: object
     *                  properties:
     *                      filename:
     *                          type: array
     *                          items:
     *                              type: string
     */
    @Post("start-download/audio")
    @Catch
    public async multipleStartDownloadAudio(req: Request, res: Response): Promise<void> {
        const { ids } = req.body;
        const videos = await Youtube.list({ids});
        if (!videos.length) {
            throw new HttpError("Videos not found", NOT_FOUND);
        }
        const payload = videos.map(video => {
            return {
                filename: `${video.title}.mp3`,
                tags: ["mp3"],
                id: video.id,
                type: "mp3",
                videoUrl: video.videoUrl,
                title: video.title
            };
        });
        await Queue.npush({
            name: "youtube",
            payload
        });
        res.status(OK).json({filename: payload.map((p) => p.filename)});
    }

}