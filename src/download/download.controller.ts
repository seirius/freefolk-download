import { Controller, Get, Param, Response as nResponse, HttpException, HttpStatus, Post, HttpCode, Body } from "@nestjs/common";
import { DownloadService } from "./download.service";
import { YoutubeService } from "./../youtube/youtube.service";
import { Response } from "express";
import { lookup } from "mime-types";
import { ApiOkResponse } from "@nestjs/swagger";
import { QueueService } from "./../queue/queue.service";
import { DownloadResponseDto, MultipleStartDownloadResponseDto, MultipleStartDownloadDto, StartDownloadAudioResponseDto, MultipleStartDownloadAudioDto, MultipleStartDownloadAudioResponseDto } from "./download.dto";

@Controller()
export class DownloadController {

    constructor(
        private readonly youtubeService: YoutubeService,
        private readonly downloadService: DownloadService,
        private readonly queueService: QueueService,
    ) {}

    @Get("download/:id")
    @ApiOkResponse({
        description: "Video download",
        content: {
            "video/mp4": {
                schema: {
                    type: "string",
                    format: "binary"
                }
            }
        }
    })
    public async download(
        @Param("id") id: string,
        @nResponse() response: Response
    ): Promise<void> {
        const [video] = await this.youtubeService.list({ids: [id]});
        const filename = `${video.title}.mp4`;
        response.setHeader("Content-disposition", "attachment; filename=" + filename);
        response.setHeader("x-suggested-filename", filename);
        response.setHeader("content-type", lookup(filename) || "application/octet-stream");
        await this.downloadService.download({
            videoUrl: video.videoUrl,
            writeStream: response as any,
            id
        });
        response.end();
    }

    @Get("start-download/:id")
    @ApiOkResponse({
        description: "Download registered",
        type: DownloadResponseDto
    })
    public async startDownload(@Param("id") id: string): Promise<DownloadResponseDto> {
        const [video] = await this.youtubeService.list({ids: [id]});
        if (!video) {
            throw new HttpException("Video not found", HttpStatus.BAD_REQUEST);
        }
        const filename = `${video.title}.mp4`;
        await this.queueService.push({
            name: "youtube",
            payload: {
                filename,
                tags: ["mp4"],
                id,
                type: "mp4",
                thumbnailUrl: video.thumbnailUrl,
                videoUrl: video.videoUrl,
                author: video.author
            }
        });
        return {filename};
    }

    @Post("start-download")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Download registered",
        type: MultipleStartDownloadResponseDto
    })
    public async multipleStartDownload(
        @Body() {ids, playlistId}: MultipleStartDownloadDto
    ): Promise<MultipleStartDownloadResponseDto> {
        const videos = ids ? await this.youtubeService.list({ids}) : await this.youtubeService.entirePlaylist(playlistId);
        if (!videos.length) {
            throw new HttpException("Videos not found", HttpStatus.NOT_FOUND);
        }
        const payload = videos.map(video => {
            const filename = `${video.title}.mp4`;
            return {
                filename,
                tags: ["mp4"],
                id: video.id,
                type: "mp4",
                thumbnailUrl: video.thumbnailUrl,
                videoUrl: video.videoUrl,
                author: video.author
            };
        });
        await this.queueService.npush({
            name: "youtube",
            payload
        });
        return {
            filename: payload.map((p) => p.filename)
        };
    }

    @Get("start-download/audio/:id")
    @ApiOkResponse({
        description: "Download registered",
        type: StartDownloadAudioResponseDto
    })
    public async startDownloadAudio(@Param("id") id: string): Promise<StartDownloadAudioResponseDto> {
        const [video] = await this.youtubeService.list({ids: [id]});
        if (!video) {
            throw new HttpException("Video not found", HttpStatus.BAD_REQUEST);
        }
        const filename = `${video.title}.mp3`;
        await this.queueService.push({
            name: "youtube",
            payload: {
                filename,
                tags: ["mp3"],
                id,
                type: "mp3",
                thumbnailUrl: video.thumbnailUrl,
                videoUrl: video.videoUrl,
                title: video.title,
                author: video.author
            }
        });
        return {filename};
    }

    @Post("start-download/audio")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Download registered",
        type: MultipleStartDownloadAudioResponseDto
    })
    public async multipleStartDownloadAudio(
        @Body() { ids, playlistId }: MultipleStartDownloadAudioDto
    ): Promise<MultipleStartDownloadAudioResponseDto> {
        const videos = ids ? await this.youtubeService.list({ids}) : await this.youtubeService.entirePlaylist(playlistId);
        if (!videos.length) {
            throw new HttpException("Videos not found", HttpStatus.NOT_FOUND);
        }
        const payload = videos.map(video => {
            return {
                filename: `${video.title}.mp3`,
                tags: ["mp3"],
                id: video.id,
                type: "mp3",
                thumbnailUrl: video.thumbnailUrl,
                videoUrl: video.videoUrl,
                title: video.title,
                author: video.author
            };
        });
        await this.queueService.npush({
            name: "youtube",
            payload
        });
        return {filename: payload.map((p) => p.filename)};
    }

}