import { Controller, Post } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller('products')
export class ProductController {
    constructor(private readonly service: ProductService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}