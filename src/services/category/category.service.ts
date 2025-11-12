import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaCategoryService } from "src/core/b1/hana/category/category.service";
import { CategoryGCV } from "src/core/interfaces/category";
import { ServiceLayerCategoryService } from "src/core/b1/serviceLayer/category/category.service";
import { BtpCatalogCategoryService } from "src/core/btp/catalog/category/category.service";

@Injectable()
export class CategoryService implements OnModuleInit {

    private logger = new Logger(CategoryService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaCategoryService,
        private readonly slService: ServiceLayerCategoryService,
        private readonly btpService: BtpCatalogCategoryService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'categorie-cron' })
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
                this.logger.log('CATEGORY - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('CATEGORY - Não encontrou registros pendentes');
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
            this.logger.log(`CATEGORY - Finalizando integração...`);
        }
    }

    async integrate(category: CategoryGCV) {
        const { ID } = category;

        if(!ID) return;

        try {
            this.logger.log(`CATEGORY - Integrando registro ${category.code} - ${category.name}`);

            const exists = await this.dbService.checkExists(category.code);

            const data = {
                Name: category.name,
                U_descr: category.descr,
                U_level: parseInt(category.level_code || '0'),
                U_parent: category.parent_code
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

            this.logger.log(`CATEGORY - Integração ${category.code} - ${category.name} realizada com sucesso!`);

            return category;
        } catch (error) {
            this.logger.error(`CATEGORY - Erro ao integrar ${category.code} -> ${error.message}`);

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
