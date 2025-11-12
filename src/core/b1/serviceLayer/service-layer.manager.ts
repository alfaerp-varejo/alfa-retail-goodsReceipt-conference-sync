import * as ServiceLayer from 'b1-service-layer';
import { ConfigService } from 'src/core/config/config.service';

interface SessionEntry {
    instance: any;
    config: any;
    isRefreshing: boolean;
    initialized: boolean;
}

class ServiceLayerManager {
    private static sessions: Record<string, SessionEntry> = {};

    /**
     * Inicializa uma sessão (principal ou alternativa)
     */
    static async init(configService: ConfigService, useAlternate = false) {
        const config = configService.getSLConfig(useAlternate);
        const companyKey = (useAlternate ? `${config.company}_ALT` : config.company)!;

        if (!this.sessions[companyKey]) {
            this.sessions[companyKey] = {
                instance: new ServiceLayer(),
                config,
                isRefreshing: false,
                initialized: false,
            };
        }

        const session = this.sessions[companyKey];

        if (!session.initialized) {
            console.log(`[ServiceLayerManager] Criando sessão para ${companyKey}...`);
            await session.instance.createSession(session.config);
            session.initialized = true;
            console.log(`[ServiceLayerManager] Sessão criada para ${companyKey}.`);
        }

        return session.instance;
    }

    /**
     * Obtém a instância da sessão (principal ou alternativa)
     */
    static async getInstance(useAlternate = false): Promise<any> {
        const companyKey = Object.keys(this.sessions).find(key =>
            useAlternate ? key.endsWith('_ALT') : !key.endsWith('_ALT')
        );

        if (!companyKey || !this.sessions[companyKey]) {
            throw new Error('Sessão ainda não inicializada. Chame init() antes.');
        }

        const session = this.sessions[companyKey];

        if (session.isRefreshing) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
            await session.instance.refreshSession();
        } catch (err: any) {
            console.warn(`[ServiceLayerManager] Falha no refresh de ${companyKey}, recriando...`);
            session.isRefreshing = true;
            try {
                await session.instance.createSession(session.config);
            } finally {
                session.isRefreshing = false;
            }
        }

        return session.instance;
    }

    static listSessions() {
        return Object.keys(this.sessions);
    }
}

export default ServiceLayerManager;