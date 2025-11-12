import { Module } from "@nestjs/common";
import { GridService } from "./grid.service";
import { HanaGridModule } from "src/core/b1/hana/grid/grid.module";
import { GridController } from "./grid.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerGridModule } from "src/core/b1/serviceLayer/grid/grid.module";
import { BtpCatalogGridModule } from "src/core/btp/catalog/grid/grid.module";

@Module({
    imports: [
        ConfigModule,
        HanaGridModule,
        ServiceLayerGridModule,
        BtpCatalogGridModule
    ],
    providers: [GridService],
    controllers: [GridController],
    exports: [GridService],
})
export class GridModule { }