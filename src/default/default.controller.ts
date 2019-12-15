import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

@Controller()
export class DefaultController {

    @Get("ping")
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Healthcheck endpoint"
    })
    ping(): string {
        return "pong";
    }

}