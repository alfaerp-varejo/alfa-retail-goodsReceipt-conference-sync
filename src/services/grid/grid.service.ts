import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaGridService } from "src/core/b1/hana/grid/grid.service";
import { ServiceLayerGridService } from "src/core/b1/serviceLayer/grid/grid.service";
import { GridB1, GridGCV, GridItemB1 } from "src/core/interfaces/grid";
import { BtpCatalogGridService } from "src/core/btp/catalog/grid/grid.service";

@Injectable()
export class GridService implements OnModuleInit {

    private logger = new Logger(GridService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaGridService,
        private readonly slService: ServiceLayerGridService,
        private readonly btpService: BtpCatalogGridService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'grid-cron' })
    async run() {
        if (this.isDev) return; // Ignora se for dev

        if (this.isRunning) return;

        await this.process();
    }

    async process() {
        try {
            this.isRunning = true;

            this.logger.log(`Start`);

            while (true) {
                this.logger.log('GRID - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('GRID - Não encontrou registros pendentes');
                    break;
                }
                                    
                for (const item of listItems) {
                    await this.integrate(item);
                }
            };           

        } catch (error) {
            this.logger.error(error.message);
        }
        finally {
            this.isRunning = false;
            this.logger.log(`GRID - Finalizando integração...`);
        }
    }

    async integrate(grid: GridGCV) {
        const { ID } = grid;

        if(!ID) return;

        try {
            this.logger.log(`CATEGORY - Integrando registro ${grid.code} - ${grid.name}`);

            const exists = await this.dbService.checkExists(grid.code);
           
			const data = this.mapAnyToEntity(grid);

            if (exists) {
                await this.slService.put(data);
            } else {
                await this.slService.post(data);
            }

            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'S',
                lastSyncDate: new Date(),
                lastSyncMessage: ''
            });

            this.logger.log(`CATEGORY - Integração ${grid.code} - ${grid.name} realizada com sucesso!`);

            return grid;
        } catch (error) {
            this.logger.error(`CATEGORY - Erro ao integrar ${grid.code} -> ${error.message}`);

            // await this.service.setReplicate(brand.Code);
            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }    

	private mapAnyToEntity(grid: GridGCV) {

        const _items = grid._items || []

		const entity: GridB1 = {
			Code: grid.code,
			Name: grid.name,
			GCV_GRIDS_ITEMSCollection: _items.map((item): GridItemB1 => {
				return {
                    LineId: item.orderItem,
					U_prefix: item.prefix,
					U_name: item.name
				}
			})
		};

		return entity;
	}
}
