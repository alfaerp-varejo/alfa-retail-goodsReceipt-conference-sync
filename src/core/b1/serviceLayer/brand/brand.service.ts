import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { BrandB1 } from "src/core/interfaces/brand";

@Injectable()
export class ServiceLayerBrandService implements OnModuleInit {

	private logger = new Logger(ServiceLayerBrandService.name);

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

	async get(code?: string): Promise<BrandB1> {
		try {
			this.logger.log(`Consultando brand ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_BRANDS('${code}')?$select=Code, Name, U_descr`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const brand: BrandB1 = response;

			this.logger.log(`Get brand ${code} - ${brand.U_descr} finalizado com sucesso!`);

			return brand;
		} catch (error) {
			throw error;
		}
	}

	async post(brand: BrandB1): Promise<BrandB1> {
		try {
			this.logger.log(`Adicionando nova brand ${brand.Code} - ${brand.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_BRANDS`, brand);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post brand ${brand.Code} - ${brand.U_descr} finalizado com sucesso!`);

			return brand;
		} catch (error) {
			throw error;
		}
	}

	async put(brand: BrandB1): Promise<BrandB1> {
		try {
			this.logger.log(`Atualizando brand ${brand.Code} - ${brand.U_descr}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_BRANDS('${brand.Code}')`, brand);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put brand ${brand.Code} - ${brand.U_descr} finalizado com sucesso!`);

			return brand;
		} catch (error) {
			throw error;
		}
	}
}