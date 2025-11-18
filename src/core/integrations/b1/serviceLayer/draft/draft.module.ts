import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerDraftService } from "./draft.service";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerDraftService],
    exports: [ServiceLayerDraftService],
})
export class ServiceLayerDraftModule { }