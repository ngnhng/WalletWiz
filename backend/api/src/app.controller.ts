import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOkResponse({
        description: "Hello World!",
        schema: {
            type: "string",
            example: "Hello World!",
        },
    })
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("health")
    @ApiResponse({ status: 200, description: "I am healthy!" })
    @ApiResponse({ status: 500, description: "I am not healthy!" })
    healthCheck(): string {
        return this.appService.healthCheck();
    }
}
