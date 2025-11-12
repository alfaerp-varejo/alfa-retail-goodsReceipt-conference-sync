import { Module } from "@nestjs/common";
import { SpecifService } from "./specif.service";
import { HanaSpecifModule } from "src/core/b1/hana/specif/specif.module";
import { SpecifController } from "./specif.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerSpecifModule } from "src/core/b1/serviceLayer/specif/specif.module";
import { BtpCatalogSpecifModule } from "src/core/btp/catalog/specif/specif.module";

@Module({
    imports: [
        ConfigModule,
        HanaSpecifModule,
        ServiceLayerSpecifModule,
        BtpCatalogSpecifModule
    ],
    providers: [SpecifService],
    controllers: [SpecifController],
    exports: [SpecifService],
})
export class SpecifModule { }