import { Module } from "@nestjs/common";
import { DefaultController } from "./default.controller";

@Module({
    controllers: [DefaultController]
})
export class DefaultModule {}