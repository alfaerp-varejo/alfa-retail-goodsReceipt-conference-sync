import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaSpecifService } from "src/core/b1/hana/specif/specif.service";
import { ServiceLayerSpecifService } from "src/core/b1/serviceLayer/specif/specif.service";
import { SpecifGCV, SpecifB1, SpecifValueB1 } from "src/common/interfaces/specif";
import { BtpCatalogSpecifService } from "src/core/btp/catalog/specif/specif.service";

@Injectable()
export class SpecifService implements OnModuleInit {

    private logger = new Logger(SpecifService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaSpecifService,
        private readonly slService: ServiceLayerSpecifService,
        private readonly btpService: BtpCatalogSpecifService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'specif-cron' })
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
                this.logger.log('SPECIFICATION - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if (listItems.length === 0) {
                    this.logger.log('SPECIFICATION - Não encontrou registros pendentes');
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
            this.logger.log(`SPECIFICATION - Finalizando integração...`);
        }
    }

    async integrate(specif: SpecifGCV) {
        const { ID, code, name } = specif;

        if (!ID) return;

        try {
            this.logger.log(`SPECIFICATION - Integrando registro ${code} - ${name}`);

            const exists = await this.dbService.checkExists(code);

            const data = this.mapAnyToEntity(specif);

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

            this.logger.log(`SPECIFICATION - Integração ${code} - ${name} realizada com sucesso!`);

            return specif;
        } catch (error) {
            this.logger.error(`SPECIFICATION - Erro ao integrar ${code} -> ${error.message}`);

            // await this.service.setReplicate(brand.Code);
            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }

    private mapAnyToEntity(specif: SpecifGCV) {

        const _values = specif._values || []

        const entity: SpecifB1 = {
            Name: specif.name,
            U_descr: specif.descr,
            GCV_SPECIF_VALUECollection: _values.map((item, i): SpecifValueB1 => {
                return {
                    LineId: ++i,
                    U_value: item.code,
                    U_name: item.name,
                    U_descr: item.descr
                }
            })
        };

        return entity;
    }
}
