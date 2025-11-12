import { Controller, Post } from "@nestjs/common";
import { SpecifService } from "./specif.service";

@Controller('grids')
export class SpecifController {
    constructor(private readonly service: SpecifService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}