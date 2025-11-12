import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { GridB1, GridItemB1 } from "src/core/interfaces/grid";

@Injectable()
export class ServiceLayerGridService implements OnModuleInit {

	private logger = new Logger(ServiceLayerGridService.name);

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

	async get(code?: string): Promise<GridB1> {
		try {
			this.logger.log(`Consultando grid ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_GRIDS('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const grid = this.mapAnyToEntity(response);

			this.logger.log(`Get grid ${code} - ${grid.Name} finalizado com sucesso!`);

			return grid;
		} catch (error) {
			throw error;
		}
	}

	async post(grid: GridB1): Promise<GridB1> {
		try {
			this.logger.log(`Adicionando nova grid ${grid.Code} - ${grid.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_GRIDS`, grid);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post grid ${grid.Code} - ${grid.Name} finalizado com sucesso!`);

			return grid;
		} catch (error) {
			throw error;
		}
	}

	async put(grid: GridB1): Promise<GridB1> {
		try {
			this.logger.log(`Atualizando grid ${grid.Code} - ${grid.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_GRIDS('${grid.Code}')`, grid);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put grid ${grid.Code} - ${grid.Name} finalizado com sucesso!`);

			return grid;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: GridB1 = {
			Code: row.Code,
			Name: row.Name,
			GCV_GRIDS_ITEMSCollection: row.GCV_GRIDS_ITEMSCollection.map((line): GridItemB1 => {
				return {
					U_prefix: line.U_prefix,
					U_name: line.U_name
				}
			})
		};

		return entity;
	}
}