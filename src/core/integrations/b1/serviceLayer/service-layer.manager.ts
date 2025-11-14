import * as ServiceLayer from 'b1-service-layer';
import * as moment from 'moment';
import { ConfigService } from 'src/core/config/config.service';

class ServiceLayerManager {
    private static instance: ServiceLayer;
    private static config: any;
    private static sessionCreatedAt: moment.Moment | null = null;
    private static sessionTimeoutMinutes = 0;

    static async init(configService: ConfigService) {
        if (!this.instance) {
            this.config = configService.getSLConfig();
            this.instance = new ServiceLayer();
            await this.login();
        }
        return this.instance;
    }

    private static async login() {
        const result = await this.instance.createSession(this.config);
        this.sessionCreatedAt = moment();
        this.sessionTimeoutMinutes = this.instance.sessionTimeout;

        console.log(`[ServiceLayerManager] Sessão criada com sucesso. Timeout: ${this.sessionTimeoutMinutes}min`);
    }

    static async getInstance(): Promise<ServiceLayer> {
        // Se ainda não foi inicializado
        if (!this.instance) {
            throw new Error('ServiceLayerManager não inicializado. Chame init() antes.');
        }

        // Se passou do timeout, renova
        const expirationTime = moment(this.sessionCreatedAt).add(this.sessionTimeoutMinutes - 1, 'minutes');
        if (moment().isAfter(expirationTime)) {
            console.log('[ServiceLayerManager] Sessão expirada, renovando...');
            await this.login();
        }

        return this.instance;
    }
}

export default ServiceLayerManager;