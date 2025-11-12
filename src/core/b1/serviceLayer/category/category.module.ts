import { ServiceLayerCategoryService } from "./category.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerCategoryService],
    exports: [ServiceLayerCategoryService],
})
export class ServiceLayerCategoryModule { }