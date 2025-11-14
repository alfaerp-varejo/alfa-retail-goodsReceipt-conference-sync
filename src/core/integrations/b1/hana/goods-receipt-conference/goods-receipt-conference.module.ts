import { HanaGoodsReceiptConferenceService } from "./goods-receipt-conference.service";
import { Module } from "@nestjs/common";
import { HanaModule } from "../database/hana.module";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [HanaModule, ConfigModule],
    controllers: [],
    providers: [HanaGoodsReceiptConferenceService],
    exports: [HanaGoodsReceiptConferenceService],
})
export class HanaGoodsReceiptConferenceModule { }