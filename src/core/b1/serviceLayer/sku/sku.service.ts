import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as ServiceLayer from 'b1-service-layer';
import { Item, ItemPrice } from "src/core/interfaces/sku";

@Injectable()
export class ServiceLayerSkuService implements OnModuleInit {

	private logger = new Logger(ServiceLayerSkuService.name);

	private sl: ServiceLayer;

	constructor(private readonly configService: ConfigService) {
		this.sl = new ServiceLayer();
	}

	async onModuleInit() {
		try {
			this.logger.debug("Iniciando sessão na Service Layer (Base principal e base complementar)");

			const configSL = this.configService.getSLConfig();

			await this.sl.createSession(configSL);

			this.logger.debug("Sessão inciada com sucesso!");
		} catch (error) {
			throw error;
		}
	}

	async get(code?: string): Promise<Item> {
		try {
			this.logger.log(`Consultando item ${code}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.get(`Items('${code}')`);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			const item = this.mapAnyToEntity(response);

			this.logger.log(`Get item ${code} - ${item.ItemName} finalizado com sucesso!`);

			return item;
		} catch (error) {
			throw error;
		}
	}

	async post(item: Item): Promise<Item> {
		try {
			this.logger.log(`Adicionando nova item ${item.ItemCode} - ${item.ItemName}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			const response = await slContext.post(`Items`, item);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Post item ${item.ItemCode} - ${item.ItemName} finalizado com sucesso!`);

			return item;
		} catch (error) {
			throw error;
		}
	}

	async put(item: Item): Promise<Item> {
		try {
			this.logger.log(`Atualizando item ${item.ItemCode} - ${item.ItemName}`);

			const slContext = this.sl;

			this.logger.debug(`Sessão usada é a ${slContext.config.company}`);

			// delete item.InventoryItem;
			// delete item.SalesItem;
			// delete item.PurchaseItem;
			// delete item.Series;

			const response = await slContext.patch(`Items('${item.ItemCode}')`, item);

			if (response.error) {
				throw new Error(response.message.error.message);
			}

			this.logger.log(`Update item ${item.ItemCode} - ${item.ItemName} finalizado com sucesso!`);

			return item;
		} catch (error) {
			throw error;
		}
	}

	private mapAnyToEntity(row: any) {

		const entity: Item = {
			ItemCode: row.ItemCode,
			ItemName: row.ItemName,
			ForeignName: row.ForeignName,
			ItemsGroupCode: row.ItemsGroupCode,
			BarCode: row.BarCode,
			PurchaseItem: row.PurchaseItem,
			SalesItem: row.SalesItem,
			InventoryItem: row.SalesItem,
			SalesUnit: row.SalesUnit,
			SalesItemsPerUnit: row.SalesItemsPerUnit,
			SalesPackagingUnit: row.SalesPackagingUnit,
			SalesQtyPerPackUnit: row.SalesQtyPerPackUnit,
			SalesUnitLength: row.SalesUnitLength,
			SalesLengthUnit: row.SalesLengthUnit,
			SalesUnitWidth: row.SalesUnitWidth,
			SalesWidthUnit: row.SalesWidthUnit,
			SalesUnitHeight: row.SalesUnitHeight,
			SalesHeightUnit: row.SalesHeightUnit,
			SalesUnitVolume: row.SalesUnitVolume,
			SalesVolumeUnit: row.SalesVolumeUnit,
			SalesUnitWeight: row.SalesUnitWeight,
			SalesWeightUnit: row.SalesWeightUnit,
			PurchaseUnit: row.PurchaseUnit,
			PurchaseItemsPerUnit: row.PurchaseItemsPerUnit,
			PurchasePackagingUnit: row.PurchasePackagingUnit,
			PurchaseQtyPerPackUnit: row.PurchaseQtyPerPackUnit,
			PurchaseUnitLength: row.PurchaseUnitLength,
			PurchaseLengthUnit: row.PurchaseLengthUnit,
			PurchaseUnitWidth: row.PurchaseUnitWidth,
			PurchaseWidthUnit: row.PurchaseWidthUnit,
			PurchaseUnitHeight: row.PurchaseUnitHeight,
			PurchaseHeightUnit: row.PurchaseHeightUnit,
			PurchaseUnitVolume: row.PurchaseUnitVolume,
			PurchaseVolumeUnit: row.PurchaseVolumeUnit,
			PurchaseUnitWeight: row.PurchaseUnitWeight,
			PurchaseWeightUnit: row.PurchaseWeightUnit,
			ItemType: row.ItemType,
			ItemClass: row.ItemClass,
			NCMCode: row.NCMCode,
			MaterialType: row.MaterialType,
			ProductSource: row.ProductSource,
			U_GCV_category_code_1: row.U_GCV_category_code_1,
			U_GCV_category_code_2: row.U_GCV_category_code_2,
			U_GCV_category_code_3: row.U_GCV_category_code_3,
			U_GCV_category_code_4: row.U_GCV_category_code_4,
			U_GCV_category_code_5: row.U_GCV_category_code_5,
			U_GCV_brand_code: row.U_GCV_brand_code,
			U_GCV_collection_code: row.U_GCV_collection_code,
			U_GCV_product_code: row.U_GCV_product_code,
			U_GCV_variant_code: row.U_GCV_variant_code,
			U_GCV_color_code: row.U_GCV_color_code,
			U_GCV_grid_code: row.U_GCV_grid_code,
			U_GCV_gridItem_prefix: row.U_GCV_gridItem_prefix,
			ItemPrices: row.ItemPrices.map((line): ItemPrice => {
				return {
					PriceList: line.PriceList,
					Price: line.Price,
					Currency: line.Currency,
					BasePriceList: line.BasePriceList,
					Factor: line.Factor
				}
			})
		};

		return entity;
	}
}