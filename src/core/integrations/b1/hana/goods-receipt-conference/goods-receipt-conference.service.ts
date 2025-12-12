import { ConfigService } from "src/core/config/config.service";
import { Config } from "src/core/config/interfaces";
import { HanaService } from "../database/hana.service";
import { readFile } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { stringFormat } from "src/common/utils/stringExtension";
import { GoodsReceiptConference } from "src/common/interfaces/goods-receipt-conference";

@Injectable()
export class HanaGoodsReceiptConferenceService {
    private env: Config;

    constructor(
        private readonly hanaService: HanaService,
        private readonly configService: ConfigService
    ) {
        this.env = this.configService.get();
    }

    async checkExists(serial?: number, chaveAcesso?: string, bplCode?: number): Promise<boolean> {
        let query: string = '';

        try {
            const dataBase = this.env.DATABASE_NAME;

            query = await readFile('src/sql/goods-receipt-conference/checkExists.sql', 'utf-8');
            query = stringFormat(query, dataBase, serial, chaveAcesso, bplCode);

            const response = await this.hanaService.query<any[]>(query);

            return response[0].contador > 0;
        } catch (error) {
            throw error;
        }
    }

    async getDraftEntryByChaveAcesso(chaveAcesso?: string): Promise<number> {
        let query: string = '';

        try {
            const ambiente = (process.env.NODE_ENV == 'development') ? "GCV_PRD" : "GCV_PRD";

            query = await readFile('src/sql/goods-receipt-conference/getByChaveAcesso.sql', 'utf-8');
            query = stringFormat(query, ambiente, chaveAcesso);

            const response = await this.hanaService.query<GoodsReceiptConference[]>(query);

            return response.length > 0 ? response[0].docEntry! : -1;
        } catch (error) {
            throw error;
        }
    }
}