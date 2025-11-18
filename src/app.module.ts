import { Logger, Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './core/config/config.module';
import { HanaGoodsReceiptConferenceModule } from './core/integrations/b1/hana/goods-receipt-conference/goods-receipt-conference.module';
import { HanaModule } from './core/integrations/b1/hana/database/hana.module';
import { hanaProvider } from './core/integrations/b1/hana/database/hana.providers';
import { BtpGoodsReceiptConferenceModule } from './core/integrations/btp/goods-receipt-conference/goods-receipt-conference.module';
import { GoodsReceiptConferenceWorker } from './services/goods-receipt-conference/goods-receipt-conference.worker';
import { ServiceLayerGoodsReceiptConferenceModule } from './core/integrations/b1/serviceLayer/goods-receipt-conference/goods-receipt-conference.module';
import { GoodsReceiptConferenceModule } from './services/goods-receipt-conference/goods-receipt-conference.module';
import { ServiceLayerDraftModule } from './core/integrations/b1/serviceLayer/draft/draft.module';
import { HanaPurchaseInvoiceModule } from './core/integrations/b1/hana/purchaseInvoice/purchaseInvoice.module';
import { ServiceLayerPurchaseCreditNoteModule } from './core/integrations/b1/serviceLayer/purchaseCreditNote/purchaseCreditNote.module';

const logger = new Logger('AppModule');

// Lê o modo ativo do .env
const WORKER_MODE = process.env.WORKER_MODE?.trim()?.toLowerCase() || '';

const workersByMode: Record<string, any[]> = {
  production: [
    GoodsReceiptConferenceWorker
  ],
};

// Seleciona os workers de acordo com o modo
const activeWorkers = workersByMode[WORKER_MODE] || [];

// Loga o modo e os workers carregados
if (activeWorkers.length > 0) {
  logger.log(`Modo "${WORKER_MODE}" detectado. Workers ativos: ${activeWorkers.map(w => w.name).join(', ')}`);
} else {
  logger.warn(`Nenhum worker foi ativado. Valor de WORKER_MODE inválido ou não definido (${WORKER_MODE || 'vazio'}).`);
  logger.warn(`Modos válidos: ${Object.keys(workersByMode).join(', ')}`);
}

@Module({
  imports: [
    ConfigModuleNest.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    HanaModule,
    HanaGoodsReceiptConferenceModule,
    HanaPurchaseInvoiceModule,
    BtpGoodsReceiptConferenceModule,
    ServiceLayerGoodsReceiptConferenceModule,
    ServiceLayerDraftModule,
    ServiceLayerPurchaseCreditNoteModule,
    GoodsReceiptConferenceModule
  ],
  controllers: [],
  providers: [hanaProvider, ...activeWorkers],
})
export class AppModule { }
