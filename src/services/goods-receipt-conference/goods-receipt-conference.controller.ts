import { Controller, Post } from "@nestjs/common";
import { GoodsReceiptConferenceService } from "./goods-receipt-conference.service";

@Controller('goodsReceiptConference')
export class GoodsReceiptConferenceController {
    constructor(private readonly service: GoodsReceiptConferenceService) { }

    @Post('run')
    runManualmente() {
        return this.service.process();
    }
}