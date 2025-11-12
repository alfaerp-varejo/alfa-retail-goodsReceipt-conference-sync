import { ServiceLayerColorService } from "./color.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerColorService],
    exports: [ServiceLayerColorService],
})
export class ServiceLayerColorModule { }