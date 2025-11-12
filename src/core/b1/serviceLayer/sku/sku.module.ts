import { ServiceLayerSkuService } from "./sku.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerSkuService],
    exports: [ServiceLayerSkuService],
})
export class ServiceLayerSkuModule { }