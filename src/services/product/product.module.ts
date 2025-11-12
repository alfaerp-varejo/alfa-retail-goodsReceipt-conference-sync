import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { HanaProductModule } from "src/core/b1/hana/product/product.module";
import { ProductController } from "./product.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerProductModule } from "src/core/b1/serviceLayer/product/product.module";
import { BtpCatalogProductModule } from "src/core/btp/catalog/product/product.module";

@Module({
    imports: [
        ConfigModule,
        HanaProductModule,
        ServiceLayerProductModule,
        BtpCatalogProductModule
    ],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService],
})
export class ProductModule { }