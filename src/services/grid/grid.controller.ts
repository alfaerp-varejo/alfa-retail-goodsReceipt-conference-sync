import { Controller, Post } from "@nestjs/common";
import { GridService } from "./grid.service";

@Controller('grids')
export class GridController {
    constructor(private readonly service: GridService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}