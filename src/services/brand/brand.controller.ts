import { Controller, Post } from "@nestjs/common";
import { BrandService } from "./brand.service";

@Controller('brands')
export class BrandController {
    constructor(private readonly service: BrandService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}