import { Controller, Post } from "@nestjs/common";
import { ColorService } from "./color.service";

@Controller('colors')
export class ColorController {
    constructor(private readonly service: ColorService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}