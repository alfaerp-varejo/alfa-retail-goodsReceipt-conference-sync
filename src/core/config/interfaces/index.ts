interface Config {
    readonly SERVICE_LAYER_URL?: string;
    readonly SERVICE_LAYER_USERNAME?: string;
    readonly SERVICE_LAYER_PASSWORD?: string;
    readonly SERVICE_LAYER_HOST?: string;
    readonly SERVICE_LAYER_PORT?: string;
    readonly SERVICE_LAYER_VERSION?: string;
    readonly SERVICE_LAYER_DEBUG?: string;
    readonly DATABASE_HOST?: string;
    readonly DATABASE_PORT?: string;
    readonly DATABASE_NAME?: string;
    readonly DATABASE_NAME_COMPLEMENTAR?: string;
    readonly DATABASE_USER?: string;
    readonly DATABASE_PASSWORD?: string;
    readonly BTP_VAREJO_URL: string;
    readonly BTP_VAREJO_CLIENT_ID: string;
    readonly BTP_VAREJO_CLIENT_SECRET: string;
    readonly BTP_VAREJO_TOKEN_URL: string;
    readonly WORKER_MODE?: string;
};

interface BtpConfig {
    host: string;
    clientId: string;
    secret: string;
    tokenUrl: string;
};

export { Config, BtpConfig };