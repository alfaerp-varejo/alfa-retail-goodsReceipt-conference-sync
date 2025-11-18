import { ConfigService } from "src/core/config/config.service";
import { BtpConfig } from "src/core/config/interfaces";
import { CapService } from "../cap/cap.service";
import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { UUID } from "crypto";
import { Sync } from "src/common/interfaces/sync";
import { GoodsReceiptConference } from "src/common/interfaces/goods-receipt-conference";

@Injectable()
export class BtpGoodsReceiptConferenceService {

    private logger = new Logger(BtpGoodsReceiptConferenceService.name);

    private env: BtpConfig;

    constructor(
        private readonly configService: ConfigService,
        private readonly capService: CapService
    ) {
        this.env = this.configService.getBtpConfig();
    }

    async getList(): Promise<GoodsReceiptConference[]> {
        try {
            this.logger.log(`Consultando lista de GoodsReceiptConferences pendentes!`);

            const headers = await this.capService.getHeaders();

            const res = await axios.get(`${this.env.host}/odata/v4/integration/GoodsReceiptConference?$top=100&$expand=_itens&$filter=lastSyncStatus_code eq 'P'`, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            const products: GoodsReceiptConference[] = response;

            return products;
        } catch (error) {
            throw error;
        }
    }

    async setSyncFields(ID: UUID, sync: Sync): Promise<boolean> {
        try {
            this.logger.log(`Atualizando GoodsReceiptConference ID (${ID})`);

            const headers = await this.capService.getHeaders();

            const res = await axios.patch(`${this.env.host}/odata/v4/integration/GoodsReceiptConference('${ID}')`, sync, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            this.logger.log(`Patch status sync GoodsReceiptConference (${ID}) finalizado com sucesso!`);

            return true;
        } catch (error) {
            throw error;
        }
    }
}