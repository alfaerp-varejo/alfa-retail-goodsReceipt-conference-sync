import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { SpecifB1, SpecifValueB1 } from "src/core/interfaces/specif";

@Injectable()
export class ServiceLayerSpecifService implements OnModuleInit {

	private logger = new Logger(ServiceLayerSpecifService.name);

	private sl: ServiceLayer;

	constructor(private readonly configService: ConfigService) {
		this.sl = new ServiceLayer();
	}

	async onModuleInit() {
		try {
			this.logger.debug("Iniciando sessão na Service Layer (Base principal e base complementar)");

			const configSL = this.configService.getSLConfig();

			await this.sl.createSession(configSL);

			this.logger.debug("Sessão inciada com sucesso!");
		} catch (error) {
			throw error;
		}
	}

	async get(code?: string): Promise<SpecifB1> {
		try {
			this.logger.log(`Consultando specif ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_SPECIF('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const specif = this.mapAnyToEntity(response);

			this.logger.log(`Get specif ${code} - ${specif.Name} finalizado com sucesso!`);

			return specif;
		} catch (error) {
			throw error;
		}
	}

	async post(specif: SpecifB1): Promise<SpecifB1> {
		try {
			this.logger.log(`Adicionando nova specif ${specif.Code} - ${specif.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_SPECIF`, specif);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post specif ${specif.Code} - ${specif.Name} finalizado com sucesso!`);

			return specif;
		} catch (error) {
			throw error;
		}
	}

	async put(specif: SpecifB1): Promise<SpecifB1> {
		try {
			this.logger.log(`Atualizando specif ${specif.Code} - ${specif.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_SPECIF('${specif.Code}')`, specif);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put specif ${specif.Code} - ${specif.Name} finalizado com sucesso!`);

			return specif;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: SpecifB1 = {
			Code: row.Code,
			Name: row.Name,
			U_descr: row.U_descr,
			GCV_SPECIF_VALUECollection: row.GCV_SPECIF_VALUECollection.map((line): SpecifValueB1 => {
				return {
					LineId: line.LineId,
					U_value: line.U_value,
					U_descr: line.U_descr,
					U_name: line.U_name
				}
			})
		};

		return entity;
	}
}