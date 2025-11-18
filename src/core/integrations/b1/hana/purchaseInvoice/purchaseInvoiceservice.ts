import { ConfigService } from "src/core/config/config.service";
import { Config } from "src/core/config/interfaces";
import { HanaService } from "../database/hana.service";
import { readFile } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { stringFormat } from "src/common/utils/stringExtension";

@Injectable()
export class HanaPurchaseInvoiceService {
    private env: Config;

    constructor(
        private readonly hanaService: HanaService,
        private readonly configService: ConfigService
    ) {
        this.env = this.configService.get();
    }

    async getPurchaseInvoicesByDraft(draftEntry?: number) {
        let query: string = '';

        try {
            const dataBase = this.env.DATABASE_NAME;

            query = await readFile('src/sql/purchaseInvoice/getPurchaseInvoicesByDraft.sql', 'utf-8');
            query = stringFormat(query, dataBase, draftEntry);

            const response = await this.hanaService.query<any[]>(query);

            return response.length > 0 ? response[0] : undefined;

        } catch (error) {
            throw error;
        }
    }
}