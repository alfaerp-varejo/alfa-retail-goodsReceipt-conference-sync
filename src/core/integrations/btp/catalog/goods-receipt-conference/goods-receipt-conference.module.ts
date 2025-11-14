import { BtpGoodsReceiptConferenceService } from "./goods-receipt-conference.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";
import { CapModule } from "../../cap/cap.module";

@Module({
    imports: [ConfigModule, CapModule],
    controllers: [],
    providers: [BtpGoodsReceiptConferenceService],
    exports: [BtpGoodsReceiptConferenceService],
})
export class BtpGoodsReceiptConferenceModule { }