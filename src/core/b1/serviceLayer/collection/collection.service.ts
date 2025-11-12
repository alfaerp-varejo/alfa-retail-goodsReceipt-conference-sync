import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { CollectionB1 } from "src/core/interfaces/collection";

@Injectable()
export class ServiceLayerCollectionService implements OnModuleInit {

	private logger = new Logger(ServiceLayerCollectionService.name);

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

	async get(code?: string): Promise<CollectionB1> {
		try {
			this.logger.log(`Consultando collection ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_COLLECTIONS('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const collection = this.mapAnyToEntity(response);

			this.logger.log(`Get collection ${code} - ${collection.U_descr} finalizado com sucesso!`);

			return collection;
		} catch (error) {
			throw error;
		}
	}

	async post(collection: CollectionB1): Promise<CollectionB1> {
		try {
			this.logger.log(`Adicionando nova collection ${collection.Code} - ${collection.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_COLLECTIONS`, collection);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post collection ${collection.Code} - ${collection.U_descr} finalizado com sucesso!`);

			return collection;
		} catch (error) {
			throw error;
		}
	}

	async put(collection: CollectionB1): Promise<CollectionB1> {
		try {
			this.logger.log(`Atualizando collection ${collection.Code} - ${collection.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_COLLECTIONS('${collection.Code}')`, collection);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put collection ${collection.Code} - ${collection.U_descr} finalizado com sucesso!`);

			return collection;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: CollectionB1 = {
			Code: row.Code,
			Name: row.Name,
			U_descr: row.U_descr,
			U_initialDate: row.U_initialDate,
			U_finalDate: row.U_finalDate
		};

		return entity;
	}
}