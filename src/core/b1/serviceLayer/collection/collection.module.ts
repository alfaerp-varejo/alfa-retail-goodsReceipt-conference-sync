import { ServiceLayerCollectionService } from "./collection.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerCollectionService],
    exports: [ServiceLayerCollectionService],
})
export class ServiceLayerCollectionModule { }