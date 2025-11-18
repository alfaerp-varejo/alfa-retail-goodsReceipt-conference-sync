import { Module } from "@nestjs/common";
import { GoodsReceiptConferenceService } from "./goods-receipt-conference.service";
import { GoodsReceiptConferenceController } from "./goods-receipt-conference.controller";
import { ConfigModule } from "src/core/config/config.module";
import { HanaGoodsReceiptConferenceModule } from "src/core/integrations/b1/hana/goods-receipt-conference/goods-receipt-conference.module";
import { BtpGoodsReceiptConferenceModule } from "src/core/integrations/btp/goods-receipt-conference/goods-receipt-conference.module";
import { ServiceLayerGoodsReceiptConferenceModule } from "src/core/integrations/b1/serviceLayer/goods-receipt-conference/goods-receipt-conference.module";
import { ServiceLayerDraftModule } from "src/core/integrations/b1/serviceLayer/draft/draft.module";
import { ServiceLayerPurchaseCreditNoteModule } from "src/core/integrations/b1/serviceLayer/purchaseCreditNote/purchaseCreditNote.module";
import { HanaPurchaseInvoiceModule } from "src/core/integrations/b1/hana/purchaseInvoice/purchaseInvoice.module";
// import { ServiceLayerSkuModule } from "src/core/b1/serviceLayer/goods-receipt-conference/goods-receipt-conference.module";

@Module({
    imports: [
        ConfigModule,
        HanaGoodsReceiptConferenceModule,
        HanaPurchaseInvoiceModule,
        ServiceLayerGoodsReceiptConferenceModule,
        ServiceLayerDraftModule,
        ServiceLayerPurchaseCreditNoteModule,
        BtpGoodsReceiptConferenceModule,
    ],
    providers: [GoodsReceiptConferenceService],
    controllers: [GoodsReceiptConferenceController],
    exports: [GoodsReceiptConferenceService],
})
export class GoodsReceiptConferenceModule { }