import { ServiceLayerProductService } from "./product.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerProductService],
    exports: [ServiceLayerProductService],
})
export class ServiceLayerProductModule { }