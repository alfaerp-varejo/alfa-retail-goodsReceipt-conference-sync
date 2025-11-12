import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { HanaBrandModule } from "src/core/b1/hana/brand/brand.module";
import { BrandController } from "./brand.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerBrandModule } from "src/core/b1/serviceLayer/brand/brand.module";
import { BtpCatalogBrandModule } from "src/core/btp/catalog/brand/brand.module";

@Module({
    imports: [
        ConfigModule,
        HanaBrandModule,
        ServiceLayerBrandModule,
        BtpCatalogBrandModule
    ],
    providers: [BrandService],
    controllers: [BrandController],
    exports: [BrandService],
})
export class BrandModule { }