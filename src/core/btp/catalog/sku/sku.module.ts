import { BtpCatalogSKUService } from "./sku.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";
import { CapModule } from "src/core/btp/cap/cap.module";

@Module({
    imports: [ConfigModule, CapModule],
    controllers: [],
    providers: [BtpCatalogSKUService],
    exports: [BtpCatalogSKUService],
})
export class BtpCatalogSKUModule { }