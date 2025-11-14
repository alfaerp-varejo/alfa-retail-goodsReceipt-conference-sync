import { BtpCatalogProductService } from "./product.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";
import { CapModule } from "src/core/btp/cap/cap.module";

@Module({
    imports: [ConfigModule, CapModule],
    controllers: [],
    providers: [BtpCatalogProductService],
    exports: [BtpCatalogProductService],
})
export class BtpCatalogProductModule { }