import { ServiceLayerGridService } from "./grid.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerGridService],
    exports: [ServiceLayerGridService],
})
export class ServiceLayerGridModule { }