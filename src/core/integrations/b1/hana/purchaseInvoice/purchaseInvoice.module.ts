import { Module } from "@nestjs/common";
import { HanaModule } from "../database/hana.module";
import { ConfigModule } from "src/core/config/config.module";
import { HanaPurchaseInvoiceService } from "./purchaseInvoiceservice";

@Module({
    imports: [HanaModule, ConfigModule],
    controllers: [],
    providers: [HanaPurchaseInvoiceService],
    exports: [HanaPurchaseInvoiceService],
})
export class HanaPurchaseInvoiceModule { }