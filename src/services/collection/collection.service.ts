import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaCollectionService } from "src/core/b1/hana/collection/collection.service";
import { ServiceLayerCollectionService } from "src/core/b1/serviceLayer/collection/collection.service";
import { CollectionGCV } from "src/core/interfaces/collection";
import { BtpCatalogCollectionService } from "src/core/btp/catalog/collection/collection.service";

@Injectable()
export class CollectionService implements OnModuleInit {

    private logger = new Logger(CollectionService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaCollectionService,
        private readonly slService: ServiceLayerCollectionService,
        private readonly btpService: BtpCatalogCollectionService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'collection-cron' })
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
                this.logger.log('COLLECTION - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('COLLECTION - Não encontrou registros pendentes');
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
            this.logger.log(`COLLECTION - Finalizando integração...`);
        }
    }

    async integrate(collection: CollectionGCV) {
        const { ID } = collection;

        if(!ID) return;

        try {
            this.logger.log(`COLLECTION - Integrando registro ${collection.code} - ${collection.name}`);

            const exists = await this.dbService.checkExists(collection.code);

            const data = {
                Code: collection.code,
                Name: collection.name,
                U_descr: collection.descr,
                U_initialDate: collection.initialDate,
                U_finalDate: collection.finalDate
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

            this.logger.log(`COLLECTION - Integração ${collection.code} - ${collection.name} realizada com sucesso!`);

            return collection;
        } catch (error) {
            this.logger.error(`COLLECTION - Erro ao integrar ${collection.code} -> ${error.message}`);

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
