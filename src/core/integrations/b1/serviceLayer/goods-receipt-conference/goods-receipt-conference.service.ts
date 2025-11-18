import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';

@Injectable()
export class ServiceLayerGoodsReceiptConferenceService {

	private logger = new Logger(ServiceLayerGoodsReceiptConferenceService.name);

	private sl: ServiceLayer;

	constructor(private readonly configService: ConfigService) {
	}

	// async get(code?: string): Promise<Document> {
	// 	try {
	// 		this.logger.log(`Consultando Recebimento de mercadoria aprovada ${code}`);

	// 		this.logger.debug(`Sessão usada é a ${this.sl.config.company}`);

	// 		const response = await this.sl.get(`GCV_BRANDS('${code}')?$select=Code, Name, U_descr`);

	// 		if (response.error) {
	// 			throw new Error(response.message.error.message);
	// 		}

	// 		const brand: Document = response;

	// 		this.logger.log(`Get brand ${code} - ${brand.U_descr} finalizado com sucesso!`);

	// 		return brand;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	// async post(brand: Document): Promise<Document> {
	// 	try {
	// 		this.logger.log(`Adicionando nova brand ${brand.Code} - ${brand.U_descr}`);

	// 		this.logger.debug(`Sessão usada é a ${this.sl.config.company}`);

	// 		const response = await this.sl.post(`GCV_BRANDS`, brand);

	// 		if (response.error) {
	// 			throw new Error(response.message.error.message);
	// 		}

	// 		this.logger.log(`Post brand ${brand.Code} - ${brand.U_descr} finalizado com sucesso!`);

	// 		return brand;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	// async put(brand: Document): Promise<Document> {
	// 	try {
	// 		this.logger.log(`Atualizando brand ${brand.Code} - ${brand.U_descr}`);

	// 		this.logger.debug(`Sessão usada é a ${this.sl.config.company}`);

	// 		const response = await this.sl.put(`GCV_BRANDS('${brand.Code}')`, brand);

	// 		if (response.error) {
	// 			throw new Error(response.message.error.message);
	// 		}

	// 		this.logger.log(`Put brand ${brand.Code} - ${brand.U_descr} finalizado com sucesso!`);

	// 		return brand;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }
}