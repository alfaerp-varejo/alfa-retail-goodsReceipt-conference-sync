import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GoodsReceiptConferenceService } from "./goods-receipt-conference.service";

@Injectable()
export class GoodsReceiptConferenceWorker {
    private isRunning = false;
    private logger = new Logger(GoodsReceiptConferenceWorker.name);

    constructor(private readonly goodsReceiptConferenceService: GoodsReceiptConferenceService) { }

    /**
     * Executa a cada minuto — ignora se um processo ainda estiver rodando.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async run() {

        if (this.isRunning) {
            this.logger.warn("Ciclo anterior ainda em execução. Ignorando nova chamada...");
            return;
        }

        this.isRunning = true;
        const startTime = Date.now();

        this.logger.log("Iniciando ciclo de integração de Notas Fiscais...");

        try {
            await this.goodsReceiptConferenceService.process();
        } catch (error: any) {
            this.logger.error(`Erro geral no ciclo: ${error.message}`);
        } finally {
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            this.logger.log(`Ciclo de integração concluído em ${duration}s.`);
            this.isRunning = false;
        }
    }
}