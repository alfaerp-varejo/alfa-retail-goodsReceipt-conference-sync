import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { HanaCategoryModule } from "src/core/b1/hana/category/category.module";
import { CategoryController } from "./category.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerCategoryModule } from "src/core/b1/serviceLayer/category/category.module";
import { BtpCatalogCategoryModule } from "src/core/btp/catalog/category/category.module";

@Module({
    imports: [
        ConfigModule,
        HanaCategoryModule,
        ServiceLayerCategoryModule,
        BtpCatalogCategoryModule
    ],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [CategoryService],
})
export class CategoryModule { }