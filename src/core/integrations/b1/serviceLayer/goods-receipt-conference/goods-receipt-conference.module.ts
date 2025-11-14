import { ServiceLayerBrandService } from "./goods-receipt-conference.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerBrandService],
    exports: [ServiceLayerBrandService],
})
export class ServiceLayerBrandModule { }