import { Module } from "@nestjs/common";
import { ColorService } from "./color.service";
import { HanaColorModule } from "src/core/b1/hana/color/color.module";
import { ColorController } from "./color.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerColorModule } from "src/core/b1/serviceLayer/color/color.module";
import { BtpCatalogColorModule } from "src/core/btp/catalog/color/color.module";

@Module({
    imports: [
        ConfigModule,
        HanaColorModule,
        ServiceLayerColorModule,
        BtpCatalogColorModule
    ],
    providers: [ColorService],
    controllers: [ColorController],
    exports: [ColorService],
})
export class ColorModule { }