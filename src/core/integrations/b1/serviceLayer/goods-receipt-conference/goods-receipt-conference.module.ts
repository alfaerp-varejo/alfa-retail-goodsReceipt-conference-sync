import { ServiceLayerGoodsReceiptConferenceService } from "./goods-receipt-conference.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerGoodsReceiptConferenceService],
    exports: [ServiceLayerGoodsReceiptConferenceService],
})
export class ServiceLayerGoodsReceiptConferenceModule { }