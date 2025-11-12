import { Controller, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";

@Controller('categories')
export class CategoryController {
    constructor(private readonly service: CategoryService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}