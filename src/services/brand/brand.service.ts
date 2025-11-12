import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaBrandService } from "src/core/b1/hana/brand/brand.service";
import { BrandGCV } from "src/core/interfaces/brand";
import { ServiceLayerBrandService } from "src/core/b1/serviceLayer/brand/brand.service";
import { BtpCatalogBrandService } from "src/core/btp/catalog/brand/brand.service";

@Injectable()
export class BrandService implements OnModuleInit {

    private logger = new Logger(BrandService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaBrandService,
        private readonly slService: ServiceLayerBrandService,
        private readonly btpService: BtpCatalogBrandService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'brand-cron' })
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
                this.logger.log('BRAND - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('BRAND - Não encontrou registros pendentes');
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
            this.logger.log(`BRAND - Finalizando integração...`);
        }
    }

    async integrate(brand: BrandGCV) {
        const { ID } = brand;

        if(!ID) return;

        try {
            this.logger.log(`BRAND - Integrando registro ${brand.code} - ${brand.name}`);

            const exists = await this.dbService.checkExists(brand.code);

            const data = {
                Code: brand.code,
                Name: brand.name,
                U_descr: brand.descr
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

            this.logger.log(`BRAND - Integração ${brand.code} - ${brand.name} realizada com sucesso!`);

            return brand;
        } catch (error) {
            this.logger.error(`BRAND - Erro ao integrar ${brand.code} -> ${error.message}`);

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
