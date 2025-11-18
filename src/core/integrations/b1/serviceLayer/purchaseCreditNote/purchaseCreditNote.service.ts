import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger } from "@nestjs/common";
import { DocumentLineSAPB1, DocumentSAPB1 } from "src/common/interfaces/document";
import ServiceLayerManager from "../service-layer.manager";

@Injectable()
export class ServiceLayerPurchaseCreditNoteService {
	private logger = new Logger(ServiceLayerPurchaseCreditNoteService.name);

	constructor(private readonly configService: ConfigService) {
	}

	async post(document: DocumentSAPB1): Promise<DocumentSAPB1> {
		const sl = await ServiceLayerManager.getInstance();

		try {
			this.logger.log(`Adicionando devolução de nota fiscal de entrada. [${document.U_ChaveAcesso}]`);

			const response = await sl.post(`PurchaseCreditNotes`, document);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const newDocument = this.mapAnyToEntity(response);

			this.logger.log(`Post de devolução de nota fiscal de entrada finalizado com sucesso! [${newDocument.DocNum} - ${document.U_ChaveAcesso}]`);

			return newDocument;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: DocumentSAPB1 = {
			DocEntry: row.DocEntry,
			DocNum: row.DocNum,
			DocDate: row.DocDate,
			CardCode: row.CardCode,
			CardName: row.CardName,
			NumAtCard: row.NumAtCard,
			BPL_IDAssignedToInvoice: row.BPL_IDAssignedToInvoice,
			U_GCV_id_venda_pdv: row.U_GCV_id_venda_pdv,
			Reference2: row.Reference2,
			Comments: row.Comments,
			SequenceCode: row.SequenceCode,
			SequenceSerial: row.SequenceSerial,
			SeriesString: row.SeriesString,
			SequenceModel: row.SequenceModel,
			PaymentGroupCode: row.PaymentGroupCode,
			DocTotal: row.DocTotal,
			TransNum: row.TransNum,
			U_ChaveAcesso: row.U_ChaveAcesso,
			DocumentLines: row.DocumentLines.map((line): DocumentLineSAPB1 => {
				return {
					LineNum: line.LineNum,
					ItemCode: line.ItemCode,
					Quantity: line.Quantity,
					DiscountPercent: line.DiscountPercent,
					CostingCode: line.CostingCode,
					ProjectCode: line.ProjectCode,
					FreeText: line.FreeText,
					MeasureUnit: line.MeasureUnit,
					LineTotal: line.LineTotal,
					Usage: line.Usage,
					UnitPrice: line.UnitPrice,
					Text: line.Text,
					CostingCode2: line.CostingCode2,
					CostingCode3: line.CostingCode3,
					CostingCode4: line.CostingCode4,
					CostingCode5: line.CostingCode5,
					BaseEntry: line.BaseEntry,
					BaseLine: line.BaseLine,
					BaseType: line.BaseType,
					U_GCV_id_venda_pdv: line.U_GCV_id_venda_pdv,
					U_GCV_lineId_venda_pdv: line.U_GCV_lineId_venda_pdv,
					U_GCV_quantity_checked: line.U_GCV_quantity_checked,
					U_GCV_divergent_quantity: line.U_GCV_divergent_quantity,
					U_GCV_checked_comments: line.U_GCV_checked_comments
				}
			})
		};

		return entity;
	}
}