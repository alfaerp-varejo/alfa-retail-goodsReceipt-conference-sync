import { Module } from "@nestjs/common";
import { SKUService } from "./sku.service";
import { HanaSkuModule } from "src/core/b1/hana/sku/sku.module";
import { SKUController } from "./sku.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerSkuModule } from "src/core/b1/serviceLayer/sku/sku.module";
import { BtpCatalogSKUModule } from "src/core/btp/catalog/sku/sku.module";

@Module({
    imports: [
        ConfigModule,
        HanaSkuModule,
        ServiceLayerSkuModule,
        BtpCatalogSKUModule
    ],
    providers: [SKUService],
    controllers: [SKUController],
    exports: [SKUService],
})
export class SkuModule { }