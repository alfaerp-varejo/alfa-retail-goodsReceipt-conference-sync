import { ConfigService } from "src/core/config/config.service";
import { Config } from "src/core/config/interfaces";
import { HanaService } from "../database/hana.service";
import { readFile } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { stringFormat } from "src/utils/stringExtension";

@Injectable()
export class HanaGridService {
    private env: Config;

    constructor(
        private readonly hanaService: HanaService,
        private readonly configService: ConfigService
    ) {
        this.env = this.configService.get();
    }

    async checkExists(code?: string) {
        let query: string = '';

        try {
            const dataBase = this.env.DATABASE_NAME;

            query = await readFile(`src/sql/grid/checkGridExists.sql`, 'utf-8');
            query = stringFormat(query, dataBase, code);

            const response = await this.hanaService.query<any[]>(query);

            return response[0].contador > 0;
        } catch (error) {
            throw error;
        }
    }
}