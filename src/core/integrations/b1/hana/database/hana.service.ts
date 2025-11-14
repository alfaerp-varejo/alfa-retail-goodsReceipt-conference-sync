import { Inject, Injectable } from '@nestjs/common';
import * as hana from '@sap/hana-client';
import { HANA_CONNECTION } from './hana.providers';
import { readFile } from "fs/promises";
import { stringFormat } from 'src/common/utils/stringExtension';

@Injectable()
export class HanaService {
    constructor(
        @Inject(HANA_CONNECTION)
        private readonly pool: ReturnType<typeof hana.createPool>) {
    }

    async query<T = any>(sql: string, params: any[] = []): Promise<T> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                try {
                    if (err || !connection) {
                        return reject(err || new Error(`Falha ao obter conexão SAP HANA \n ${sql}`));
                    }

                    connection.exec<T>(sql, params, (execErr, result) => {
                        connection.disconnect(); //  Libera a conexão após o uso
                        if (execErr) {
                            return reject(execErr);
                        }
                        resolve(result!);
                    });
                } catch (error) {
                    const response = { code: 'D00003', innerMessage: error.message, message: error.message };
                    return reject(response);
                }
            });
        });
    }

    async checkSchemaExists(schemaName?: string) {
        let query: string = '';

        try {
            query = await readFile('src/sql/checkSchemaExists.sql', 'utf-8');
            query = stringFormat(query, schemaName);

            const response = await this.query<any>(query);

            return response[0].contador > 0;
        } catch (error) {
            throw error;
        }
    }

    async checkTableExists(schemaName?: string, tableName?: string) {
        let query: string = '';

        try {
            query = await readFile('src/sql/checkTableExists.sql', 'utf-8');
            query = stringFormat(query, schemaName, tableName);

            const response = await this.query(query);

            return response[0].contador > 0;
        } catch (error) {
            throw error;
        }
    }

    async createSchema(schemaName: string) {
        let query: string = '';

        try {
            query = await readFile('src/sql/createSchema.sql', 'utf-8');
            query = stringFormat(query, schemaName);

            await this.query(query);
        } catch (error) {
            throw error;
        }
    }
}