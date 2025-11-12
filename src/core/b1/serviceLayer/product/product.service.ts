import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { ProductB1, ProductSpecifB1, ProductVariantB1 } from "src/core/interfaces/product";

@Injectable()
export class ServiceLayerProductService implements OnModuleInit {

	private logger = new Logger(ServiceLayerProductService.name);

	private sl: ServiceLayer;

	constructor(private readonly configService: ConfigService) {
		this.sl = new ServiceLayer();
	}

	async onModuleInit() {
		try {
			this.logger.debug("Iniciando sessão na Service Layer (Base principal e base complementar)");

			const configSL = this.configService.getSLConfig();

			await this.sl.createSession(configSL)

			this.logger.debug("Sessão inciada com sucesso!");
		} catch (error) {
			throw error;
		}
	}

	async get(code?: string): Promise<ProductB1> {
		try {
			this.logger.log(`Consultando product ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`GCV_PRODUCTS('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const product = this.mapAnyToEntity(response);

			this.logger.log(`Get product ${code} - ${product.Name} finalizado com sucesso!`);

			return product;
		} catch (error) {
			throw error;
		}
	}

	async post(product: ProductB1): Promise<ProductB1> {
		try {
			this.logger.log(`Adicionando nova product ${product.Code} - ${product.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`GCV_PRODUCTS`, product);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post product ${product.Code} - ${product.Name} finalizado com sucesso!`);

			return product;
		} catch (error) {
			throw error;
		}
	}

	async put(product: ProductB1): Promise<ProductB1> {
		try {
			this.logger.log(`Atualizando product ${product.Code} - ${product.Name}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.put(`GCV_PRODUCTS('${product.Code}')`, product);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Put product ${product.Code} - ${product.Name} finalizado com sucesso!`);

			return product;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: ProductB1 = {
			Code: row.Code,
			Name: row.Name,
			U_title: row.U_title,
			U_active: row.U_active,
			U_brand_code: row.U_brand_code,
			U_category_code_1: row.U_category_code_1,
			U_category_code_2: row.U_category_code_2,
			U_category_code_3: row.U_category_code_3,
			U_category_code_4: row.U_category_code_4,
			U_category_code_5: row.U_category_code_5,
			U_collection_code: row.U_collection_code,
			U_description: row.U_description,
			U_grid_code: row.U_grid_code,
			U_itemGroup_code: row.U_itemGroup_code,
			U_markup: row.U_markup,
			U_material_code: row.U_material_code,
			U_salePrice: row.U_salePrice,
			U_source_code: row.U_source_code,
			U_unitCost: row.U_unitCost,
			U_visible: row.U_visible,
			GCV_PROD_SPECIFCollection: row.GCV_PROD_SPECIFCollection.map((line): ProductSpecifB1 => {
				return {
					LineId: line.LineId,
					U_specification_code: line.U_specification_code,
					U_value_code: line.U_value_code
				}
			}),
			GCV_VARIANTSCollection: row.GCV_VARIANTSCollection.map((line): ProductVariantB1 => {
				return {
					LineId: line.LineId,
					U_color_code: line.U_color_code,
					U_variant_code: line.U_variant_code,
					U_variant_name: line.U_variant_name
				}
			})
		};

		return entity;
	}
}