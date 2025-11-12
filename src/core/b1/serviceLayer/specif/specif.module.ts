import { ServiceLayerSpecifService } from "./specif.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerSpecifService],
    exports: [ServiceLayerSpecifService],
})
export class ServiceLayerSpecifModule { }