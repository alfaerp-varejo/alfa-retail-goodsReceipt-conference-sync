import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { ColorB1 } from "src/core/interfaces/color";

@Injectable()
export class ServiceLayerColorService implements OnModuleInit {

	private logger = new Logger(ServiceLayerColorService.name);

	private sl: ServiceLayer;

	constructor(private readonly configService: ConfigService) {
		this.sl = new ServiceLayer();
	}

	async onModuleInit() {
		try {
			this.logger.debug("Iniciando sessão na Service Layer (Base principal e base complementar)");

			const configSL = this.configService.getSLConfig();

			await this.sl.createSession(configSL)

			this.logger.debug("Sessão inciada com sucesso!");
		} catch (error) {
			throw error;
		}
	}

	async get(code?: string): Promise<ColorB1> {
		try {
			this.logger.log(`Consultando color ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_COLORS('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const color = this.mapAnyToEntity(response);

			this.logger.log(`Get color ${code} - ${color.Name} finalizado com sucesso!`);

			return color;
		} catch (error) {
			throw error;
		}
	}

	async post(color: ColorB1): Promise<ColorB1> {
		try {
			this.logger.log(`Adicionando nova color ${color.Code} - ${color.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_COLORS`, color);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post color ${color.Code} - ${color.Name} finalizado com sucesso!`);

			return color;
		} catch (error) {
			throw error;
		}
	}

	async put(color: ColorB1): Promise<ColorB1> {
		try {
			this.logger.log(`Atualizando color ${color.Code} - ${color.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_COLORS('${color.Code}')`, color);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put color ${color.Code} - ${color.Name} finalizado com sucesso!`);

			return color;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: ColorB1 = {
			Code: row.Code,
			Name: row.Name
		};

		return entity;
	}
}