import { Module } from "@nestjs/common";
import { FileManagerService } from "./filemanager.service";

@Module({
    providers: [FileManagerService],
    exports: [FileManagerService]
})
export class FileManagerModule {}