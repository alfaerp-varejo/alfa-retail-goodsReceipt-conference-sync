import { ConfigService } from "src/core/config/config.service";
import { BtpConfig } from "src/core/config/interfaces";
import { CapService } from "../../cap/cap.service";
import { Injectable, Logger } from "@nestjs/common";
import { GridGCV } from "src/core/interfaces/grid";
import axios from 'axios';
import { UUID } from "crypto";
import { Sync } from "src/core/interfaces/sync";

@Injectable()
export class BtpCatalogGridService {

    private logger = new Logger(BtpCatalogGridService.name);

    private env: BtpConfig;

    constructor(
        private readonly configService: ConfigService,
        private readonly capService: CapService
    ) {
        this.env = this.configService.getBtpConfig();
    }

    async getList(): Promise<GridGCV[]> {
        try {
            this.logger.log(`Consultando lista de Grids pendentes!`);

            const headers = await this.capService.getHeaders();

            const res = await axios.get(`${this.env.host}/odata/v4/integration/Grids?$top=100&$expand=_items&$filter=lastSyncStatus_code eq 'P'`, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            const grids: GridGCV[] = response;

            return grids;
        } catch (error) {
            throw error;
        }
    }

    async setSyncFields(ID: UUID, sync: Sync): Promise<boolean> {
        try {
            this.logger.log(`Atualizando Grid ID (${ID})`);

            const headers = await this.capService.getHeaders();
            
            const res = await axios.patch(`${this.env.host}/odata/v4/integration/Grids(ID=${ID})`, sync, { headers });
            const response = res.data.value ?? res.data;

            if (response.error) {
                throw new Error(response.message.error.message);
            }

            this.logger.log(`Patch status sync Grid (${ID}) finalizado com sucesso!`);

            return true;
        } catch (error) {
            throw error;
        }
    }
}