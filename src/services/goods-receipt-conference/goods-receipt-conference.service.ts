import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DocumentLineSAPB1, DocumentSAPB1 } from "src/common/interfaces/document";
import { GoodsReceiptConference, GoodsReceiptConferenceItem } from "src/common/interfaces/goods-receipt-conference";
import { HanaGoodsReceiptConferenceService } from "src/core/integrations/b1/hana/goods-receipt-conference/goods-receipt-conference.service";
import { ServiceLayerGoodsReceiptConferenceService } from "src/core/integrations/b1/serviceLayer/goods-receipt-conference/goods-receipt-conference.service";
import { BtpGoodsReceiptConferenceService } from "src/core/integrations/btp/goods-receipt-conference/goods-receipt-conference.service";
import { ServiceLayerPurchaseCreditNoteService } from "src/core/integrations/b1/serviceLayer/purchaseCreditNote/purchaseCreditNote.service";
import { HanaPurchaseInvoiceService } from "src/core/integrations/b1/hana/purchaseInvoice/purchaseInvoiceservice";
import { ServiceLayerDraftService } from "src/core/integrations/b1/serviceLayer/draft/draft.service";

@Injectable()
export class GoodsReceiptConferenceService implements OnModuleInit {

    private logger = new Logger(GoodsReceiptConferenceService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaGoodsReceiptConferenceService,
        private readonly dbPurchaseInvoice: HanaPurchaseInvoiceService,
        private readonly slService: ServiceLayerPurchaseCreditNoteService,
        private readonly serviceLayerDraftService: ServiceLayerDraftService,
        private readonly btpService: BtpGoodsReceiptConferenceService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    async process() {
        try {
            this.isRunning = true;

            this.logger.log(`Start`);

            let listGoodsReceiptConferences: GoodsReceiptConference[] = [];

            do {
                this.logger.log('GoodsReceiptConference - Consultando registros pendentes');

                listGoodsReceiptConferences = await this.btpService.getList();

                if (listGoodsReceiptConferences.length === 0) {
                    this.logger.log('Confererência de mercadoria - Não encontrou registros pendentes');
                    break;
                }

                this.logger.log(`Confererência de mercadoria - ${listGoodsReceiptConferences.length} registros pendentes encontrados`);
                this.logger.debug(`Confererência de mercadoria: ${JSON.stringify(listGoodsReceiptConferences)}`);

                for (const item of listGoodsReceiptConferences) {
                    await this.integrate(item);
                }

            } while (listGoodsReceiptConferences.length > 0);

        } catch (error) {
            this.logger.error(error.message);
        }
        finally {
            this.isRunning = false;
            this.logger.log(`GoodsReceiptConference - Finalizando integração...`);
        }
    }

    async integrate(goodsReceiptConference: GoodsReceiptConference) {
        const { ID, serial, cardCode, cardName, chaveAcesso, bplCode, docEntry } = goodsReceiptConference;

        if (!ID) return;

        try {
            this.logger.log(`Confererência de mercadoria - Integrando registro ${serial} -> ${cardCode} - ${cardName}`);

            const exists = await this.dbService.checkExists(serial, chaveAcesso, bplCode);

            if (!exists) {
                await this.serviceLayerDraftService.saveToDocument(docEntry!);

                if (goodsReceiptConference._itens?.some(item => item.divergentQuantity! > 0)) {
                    const purchaseInfo = await this.dbPurchaseInvoice.getPurchaseInvoicesByDraft(docEntry);
                    const document = this.mapAnyToEntity(purchaseInfo.DocEntry!, goodsReceiptConference);

                    await this.slService.post(document);
                }
            }

            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'S',
                lastSyncDate: new Date(),
                lastSyncMessage: ''
            });

            this.logger.log(`Confererência de mercadoria - Integração ${ID} - ${serial} realizada com sucesso!`);

            return goodsReceiptConference;
        } catch (error) {
            this.logger.error(`Confererência de mercadoria - Erro ao integrar ${ID} -> ${error.message}`);

            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }

    private mapAnyToEntity(purchaseDocEntry: number, goodsReceiptConference: GoodsReceiptConference) {

        const entity: DocumentSAPB1 = {
            DocumentLines: goodsReceiptConference._itens!.map((line): DocumentLineSAPB1 => {
                return {
                    BaseEntry: purchaseDocEntry,
                    BaseLine: line.baseLine,
                    BaseType: '18',
                    Quantity: line.beeped == 'N' ? Number(line.quantity) : ((Number(line.quantity) - Number(line.quantityChecked)) + (Number(line.divergentQuantity))),
                }
            })
        };

        return entity;
    }
}