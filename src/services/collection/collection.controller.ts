import { Controller, Post } from "@nestjs/common";
import { CollectionService } from "./collection.service";

@Controller('collections')
export class CollectionController {
    constructor(private readonly service: CollectionService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}