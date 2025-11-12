import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { CategoryB1 } from "src/core/interfaces/category";

@Injectable()
export class ServiceLayerCategoryService implements OnModuleInit {

	private logger = new Logger(ServiceLayerCategoryService.name);

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

	async get(code?: string): Promise<CategoryB1> {
		try {
			this.logger.log(`Consultando categorie ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_CATEGORIES('${code}')?$select=Code, Name, U_descr, U_level, U_parent`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const categorie: CategoryB1 = response;

			this.logger.log(`Get categorie ${code} - ${categorie.U_descr} finalizado com sucesso!`);

			return categorie;
		} catch (error) {
			throw error;
		}
	}

	async post(categorie: CategoryB1): Promise<CategoryB1> {
		try {
			this.logger.log(`Adicionando nova categorie ${categorie.Code} - ${categorie.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_CATEGORIES`, categorie);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post categorie ${categorie.Code} - ${categorie.U_descr} finalizado com sucesso!`);

			return categorie;
		} catch (error) {
			throw error;
		}
	}

	async put(categorie: CategoryB1): Promise<CategoryB1> {
		try {
			this.logger.log(`Atualizando categorie ${categorie.Code} - ${categorie.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_CATEGORIES('${categorie.Code}')`, categorie);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put categorie ${categorie.Code} - ${categorie.U_descr} finalizado com sucesso!`);

			return categorie;
		} catch (error) {
			throw error;
		}
	}
}