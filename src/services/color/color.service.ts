import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaColorService } from "src/core/b1/hana/color/color.service";
import { ServiceLayerColorService } from "src/core/b1/serviceLayer/color/color.service";
import { ColorGCV } from "src/core/interfaces/color";
import { BtpCatalogColorService } from "src/core/btp/catalog/color/color.service";

@Injectable()
export class ColorService implements OnModuleInit {

    private logger = new Logger(ColorService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaColorService,
        private readonly slService: ServiceLayerColorService,
        private readonly btpService: BtpCatalogColorService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'color-cron' })
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
                this.logger.log('COLOR - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('COLOR - Não encontrou registros pendentes');
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
            this.logger.log(`COLOR - Finalizando integração...`);
        }
    }

    async integrate(color: ColorGCV) {
        const { ID } = color;

        if(!ID) return;

        try {
            this.logger.log(`COLOR - Integrando registro ${color.code} - ${color.name}`);

            const exists = await this.dbService.checkExists(color.code);

            const data = {
                Code: color.code,
                Name: color.name
            }

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

            this.logger.log(`COLOR - Integração ${color.code} - ${color.name} realizada com sucesso!`);

            return color;
        } catch (error) {
            this.logger.error(`COLOR - Erro ao integrar ${color.code} -> ${error.message}`);

            // await this.service.setReplicate(brand.Code);
            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }
}
