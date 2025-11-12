import { ConfigService } from "src/core/config/config.service";
import { BtpConfig } from "src/core/config/interfaces";
import { CapService } from "../../cap/cap.service";
import { Injectable, Logger } from "@nestjs/common";
import { CollectionGCV } from "src/core/interfaces/collection";
import axios from 'axios';
import { UUID } from "crypto";
import { Sync } from "src/core/interfaces/sync";

@Injectable()
export class BtpCatalogCollectionService {

    private logger = new Logger(BtpCatalogCollectionService.name);

    private env: BtpConfig;

    constructor(
        private readonly configService: ConfigService,
        private readonly capService: CapService
    ) {
        this.env = this.configService.getBtpConfig();
    }

    async getList(): Promise<CollectionGCV[]> {
        try {
            this.logger.log(`Consultando lista de Collections pendentes!`);

            const headers = await this.capService.getHeaders();

            const res = await axios.get(`${this.env.host}/odata/v4/integration/Collections?$top=100&$filter=lastSyncStatus_code eq 'P'`, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            const collections: CollectionGCV[] = response;

            return collections;
        } catch (error) {
            throw error;
        }
    }

    async setSyncFields(ID: UUID, sync: Sync): Promise<boolean> {
        try {
            this.logger.log(`Atualizando collection ID (${ID})`);

            const headers = await this.capService.getHeaders();
            
            const res = await axios.patch(`${this.env.host}/odata/v4/integration/Collections(ID=${ID})`, sync, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            this.logger.log(`Patch status sync collection (${ID}) finalizado com sucesso!`);

            return true;
        } catch (error) {
            throw error;
        }
    }
}