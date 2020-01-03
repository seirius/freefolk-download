import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ServerConfig } from "./config/ServerConfig";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggerConfig } from "./config/LoggerConfig";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: LoggerConfig.LEVEL as any,
    });

    const options = new DocumentBuilder()
    .setTitle("Freefolk microservice template")
    .setDescription("Freefolk microservice template")
    .setVersion("1.5")
    .addTag("freefolk")
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api", app, document);

    await app.listen(ServerConfig.PORT);
    new Logger().log(`Server running on http://localhost:${ServerConfig.PORT}`);
}
bootstrap();
