import { Module } from "@nestjs/common";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerPurchaseCreditNoteService } from "./purchaseCreditNote.service";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [ServiceLayerPurchaseCreditNoteService],
    exports: [ServiceLayerPurchaseCreditNoteService],
})
export class ServiceLayerPurchaseCreditNoteModule { }