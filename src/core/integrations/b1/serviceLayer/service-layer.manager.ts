import * as ServiceLayer from 'b1-service-layer';
import * as moment from 'moment';
import { ConfigService } from 'src/core/config/config.service';

interface SessionEntry {
    instance: any;
    config: any;
    sessionCreatedAt: moment.Moment | null;
    sessionTimeoutMinutes: number;
    isRefreshing: boolean;
    initialized: boolean;
}

interface CompanyPool {
    sessions: SessionEntry[];
    pointer: number; // round-robin index
}

class ServiceLayerManager {
    private static pools: Record<string, CompanyPool> = {};

    /**
     * Inicializa o pool de sessões da Service Layer para a company (principal ou alternativa).
     *
     * @param configService  ConfigService do seu projeto
     * @param useAlternate   Se true, usa a base alternativa (ex: company_ALT)
     * @param poolSize       Quantidade de sessões no pool (use 4 para 4 nodes)
     */
    static async init(
        configService: ConfigService,
        useAlternate = false,
        poolSize = 4
    ) {
        const config = configService.getSLConfig(useAlternate);
        const companyKey = (useAlternate ? `${config.company}_ALT` : config.company)!;

        if (!this.pools[companyKey]) {
            this.pools[companyKey] = {
                sessions: [],
                pointer: 0,
            };
        }

        const pool = this.pools[companyKey];

        // Cria o pool apenas uma vez
        if (pool.sessions.length === 0) {
            console.log(
                `[ServiceLayerManager] Criando pool com ${poolSize} sessões para ${companyKey}...`
            );

            for (let i = 0; i < poolSize; i++) {
                const session: SessionEntry = {
                    instance: new (ServiceLayer as any)(),
                    config,
                    sessionCreatedAt: null,
                    sessionTimeoutMinutes: 0,
                    isRefreshing: false,
                    initialized: false,
                };

                pool.sessions.push(session);

                await this.createNewSession(companyKey, session, i);
                session.initialized = true;
            }

            console.log(
                `[ServiceLayerManager] Pool criado para ${companyKey} com ${pool.sessions.length} sessões.`
            );
        }

        // Opcional: já retorna uma instância pronta, se você quiser usar direto após o init
        return this.getInstance(useAlternate);
    }

    /**
     * Retorna uma instância da Service Layer usando round-robin real.
     * Garante que a sessão está válida (timeout checado) e renova se necessário.
     */
    static async getInstance(useAlternate = false): Promise<any> {
        const companyKey = Object.keys(this.pools).find(key =>
            useAlternate ? key.endsWith('_ALT') : !key.endsWith('_ALT')
        );

        if (!companyKey) {
            throw new Error(
                'Sessão não inicializada. Chame ServiceLayerManager.init(configService) no bootstrap do módulo.'
            );
        }

        const pool = this.pools[companyKey];

        if (!pool.sessions.length) {
            throw new Error(`Pool vazio para companyKey ${companyKey}.`);
        }

        // Round-robin real: pega o índice atual e já avança o ponteiro
        const index = pool.pointer;
        pool.pointer = (pool.pointer + 1) % pool.sessions.length;

        const session = pool.sessions[index];

        // Se já tem um refresh em andamento, espera um pouco
        if (session.isRefreshing) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Verifica se essa sessão específica expirou
        if (this.isExpired(session)) {
            console.log(
                `[ServiceLayerManager] Sessão #${index} expirada para ${companyKey}, renovando...`
            );
            await this.safeRefresh(companyKey, session, index);
        }

         console.log(
                `[ServiceLayerManager] Usando a  Sessão #${index} para ${companyKey}.`
            );

        return session.instance;
    }

    /**
     * Verifica se a sessão expirou com base no timestamp salvo e no timeout informado pela SL.
     */
    private static isExpired(session: SessionEntry): boolean {
        if (!session.sessionCreatedAt || session.sessionTimeoutMinutes === 0) {
            return true;
        }

        const expiresAt = moment(session.sessionCreatedAt).add(
            session.sessionTimeoutMinutes - 1,
            'minutes'
        );

        return moment().isAfter(expiresAt);
    }

    /**
     * Tenta renovar a sessão específica (sem usar refreshSession da lib).
     * Se falhar, tenta recriar.
     */
    private static async safeRefresh(
        companyKey: string,
        session: SessionEntry,
        index: number
    ) {
        if (session.isRefreshing) {
            // Outro fluxo já está renovando
            return;
        }

        session.isRefreshing = true;

        try {
            await this.createNewSession(companyKey, session, index);
        } catch (err) {
            console.warn(
                `[ServiceLayerManager] Erro ao renovar sessão #${index} de ${companyKey}, tentando recriar...`,
                (err as any)?.message
            );
            await this.createNewSession(companyKey, session, index);
        } finally {
            session.isRefreshing = false;
        }
    }

    /**
     * Cria uma nova sessão manualmente para uma entry específica do pool.
     */
    private static async createNewSession(
        companyKey: string,
        session: SessionEntry,
        index: number
    ) {
        const result = await session.instance.createSession(session.config);

        session.sessionCreatedAt = moment();
        session.sessionTimeoutMinutes = session.instance.sessionTimeout || 20;

        console.log(
            `[ServiceLayerManager] Nova sessão criada (${companyKey} #${index}). Timeout: ${session.sessionTimeoutMinutes}min`
        );

        return result;
    }

    /**
     * Lista sessões/pools ativos
     */
    static listSessions() {
        const summary: Record<string, { total: number }> = {};

        for (const [key, pool] of Object.entries(this.pools)) {
            summary[key] = { total: pool.sessions.length };
        }

        return summary;
    }
}

export default ServiceLayerManager;