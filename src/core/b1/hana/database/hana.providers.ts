import { Provider } from '@nestjs/common';
import * as hana from '@sap/hana-client';
import { ConfigService } from 'src/core/config/config.service';

export const HANA_CONNECTION = 'HANA_CONNECTION';

export const hanaProvider: Provider = {
    provide: HANA_CONNECTION,
    useFactory: async (configService: ConfigService): Promise<ReturnType<typeof hana.createPool>> => {

        const env = configService.get();

        const config = {
            min: 2,
            max: 10,
            serverNode: `${env.DATABASE_HOST}:${env.DATABASE_PORT}`, // Exemplo: 'myhana.server.com:30015'
            uid: `${env.DATABASE_USER}`,
            pwd: `${env.DATABASE_PASSWORD}`,
            encrypt: 'false',
        };

        const pool = hana.createPool(config);

        return pool;
    },
    inject: [ConfigService],
};