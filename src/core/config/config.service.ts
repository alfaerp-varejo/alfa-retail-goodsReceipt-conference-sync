import { Injectable } from "@nestjs/common";
import { Config, BtpConfig } from './interfaces';
import { config } from 'dotenv';

config();

@Injectable()
export class ConfigService {
    private readonly envConfig: Config;

    constructor() {
        const config: Config = {
            SERVICE_LAYER_URL: process.env.SERVICE_LAYER_URL,
            SERVICE_LAYER_USERNAME: process.env.SERVICE_LAYER_USERNAME,
            SERVICE_LAYER_PASSWORD: process.env.SERVICE_LAYER_PASSWORD,
            SERVICE_LAYER_HOST: process.env.SERVICE_LAYER_HOST,
            SERVICE_LAYER_PORT: process.env.SERVICE_LAYER_PORT,
            SERVICE_LAYER_VERSION: process.env.SERVICE_LAYER_VERSION,
            SERVICE_LAYER_DEBUG: process.env.SERVICE_LAYER_DEBUG,
            DATABASE_HOST: process.env.DATABASE_HOST,
            DATABASE_PORT: process.env.DATABASE_PORT,
            DATABASE_NAME: process.env.DATABASE_NAME,
            DATABASE_NAME_COMPLEMENTAR: process.env.DATABASE_NAME_COMPLEMENTAR,
            DATABASE_USER: process.env.DATABASE_USER,
            DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
            BTP_VAREJO_URL: process.env.BTP_VAREJO_URL!,
            BTP_VAREJO_CLIENT_ID: process.env.BTP_VAREJO_CLIENT_ID!,
            BTP_VAREJO_CLIENT_SECRET: process.env.BTP_VAREJO_CLIENT_SECRET!,
            BTP_VAREJO_TOKEN_URL: process.env.BTP_VAREJO_TOKEN_URL!,
            WORKER_MODE: process.env.WORKER_MODE || 'development',
        }

        this.envConfig = config;
    }

    get(): Config {
        return this.envConfig;
    }

    getSLConfig(baseComplementar = false) {
        const env = this.get();
        return {
            host: env.SERVICE_LAYER_HOST,
            username: env.SERVICE_LAYER_USERNAME,
            password: env.SERVICE_LAYER_PASSWORD,
            company: (!baseComplementar ? env.DATABASE_NAME : env.DATABASE_NAME_COMPLEMENTAR),
            port: env.SERVICE_LAYER_PORT,
            version: env.SERVICE_LAYER_VERSION,
            debug: env.SERVICE_LAYER_VERSION
        }
    }

    getBtpConfig(): BtpConfig {
        const env = this.get();
        return {
            host: env.BTP_VAREJO_URL,
            clientId: env.BTP_VAREJO_CLIENT_ID,
            secret: env.BTP_VAREJO_CLIENT_SECRET,
            tokenUrl: env.BTP_VAREJO_TOKEN_URL
        }
    }
}
