import { Module } from '@nestjs/common';
import { DefaultModule } from './default/default.module';

@Module({
    imports: [DefaultModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
