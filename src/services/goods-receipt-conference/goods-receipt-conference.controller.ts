import { Controller, Post } from "@nestjs/common";
import { SKUService } from "./goods-receipt-conference.service";

@Controller('skus')
export class SKUController {
    constructor(private readonly service: SKUService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}