import { Module } from "@nestjs/common";
import { WorkerManagerService } from "./worker-manager.service";
import { DownloadService } from "./download.service";
import { QueueModule } from "./../queue/queue.module";
import { FileManagerModule } from "./../filemanager/filemanager.module";
import { ConverterModule } from "./../converter/converter.module";
import { DownloadController } from "./download.controller";
import { YoutubeModule } from "./../youtube/youtube.module";

@Module({
    imports: [
        YoutubeModule,
        QueueModule,
        FileManagerModule,
        ConverterModule
    ],
    providers: [
        WorkerManagerService,
        DownloadService,
    ],
    exports: [
        WorkerManagerService,
        DownloadService
    ],
    controllers: [DownloadController]
})
export class DownloadModule {}