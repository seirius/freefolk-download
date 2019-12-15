import { Module } from '@nestjs/common';
import { DefaultModule } from './default/default.module';
import { DownloadModule } from './download/download.module';

@Module({
    imports: [DefaultModule, DownloadModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
