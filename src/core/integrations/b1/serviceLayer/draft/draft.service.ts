import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { DocumentSAPB1 } from "src/common/interfaces/document";

@Injectable()
export class ServiceLayerDraftService {
	private logger = new Logger(ServiceLayerDraftService.name);

	constructor(private readonly configService: ConfigService) {
	}

	async get(docEntry?: number): Promise<DocumentSAPB1> {
		const sl = await ServiceLayer.getInstance();

		try {
			this.logger.log(`Consultando Esboço de Recebimento de mercadoria aprovada ${docEntry}`);

			const response = await sl.get(`Drafts(${docEntry})`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const draft: DocumentSAPB1 = response;

			this.logger.log(`Get draft ${docEntry} - ${draft.U_ChaveAcesso} finalizado com sucesso!`);

			return draft;
		} catch (error) {
			throw error;
		}
	}

	async saveToDocument(docEntry: number) {
		const sl = await ServiceLayer.getInstance();
		try {
			this.logger.log(`Efetivando esboço como um novo documento ${docEntry}`);

			const newDocument = {
				Document: {
					DocEntry: docEntry
				}
			};

			const response = await sl.post(`DraftsService_SaveDraftToDocument`, newDocument);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Save draft to document ${docEntry} finalizado com sucesso!`);
		} catch (error) {
			throw error;
		}
	}

	async patch(draft: DocumentSAPB1): Promise<DocumentSAPB1> {
		const sl = await ServiceLayer.getInstance();

		try {
			this.logger.log(`Atualizando draft ${draft.DocEntry} - ${draft.U_ChaveAcesso}`);

			const docEntry = draft.DocEntry;
			delete draft.DocEntry;

			const response = await sl.patch(`Drafts(${docEntry})`, draft);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Patch draft ${docEntry} - ${draft.U_ChaveAcesso} finalizado com sucesso!`);

			return draft;
		} catch (error) {
			throw error;
		}
	}
}