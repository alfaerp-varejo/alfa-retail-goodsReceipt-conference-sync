import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaSkuService } from "src/core/b1/hana/sku/sku.service";
import { ServiceLayerSkuService } from "src/core/b1/serviceLayer/sku/sku.service";
import { Item, SKU } from "src/core/interfaces/sku";
import { BtpCatalogSKUService } from "src/core/btp/catalog/sku/sku.service";

@Injectable()
export class SKUService implements OnModuleInit {

    private logger = new Logger(SKUService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
            private readonly dbService: HanaSkuService,
            private readonly slService: ServiceLayerSkuService,
            private readonly btpService: BtpCatalogSKUService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'item-cron' })
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
                this.logger.log('SKU - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('SKU - Não encontrou registros pendentes');
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
            this.logger.log(`SKU - Finalizando integração...`);
        }
    }

    async integrate(sku: SKU) {
        const { ID, code, name } = sku;

        if(!ID) return;

        try {
            this.logger.log(`sku - Integrando registro ${code} - ${name}`);

            const exists = await this.dbService.checkExists(code);
           
			const data = this.mapAnyToEntity(sku);

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

            this.logger.log(`sku - Integração ${code} - ${name} realizada com sucesso!`);

            return sku;
        } catch (error) {
            this.logger.error(`sku - Erro ao integrar ${code} -> ${error.message}`);

            // await this.service.setReplicate(brand.Code);
            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }    

	private mapAnyToEntity(sku: SKU) {

		const entity: Item = {}
        
        entity.InventoryItem = 'tYES';
        entity.SalesItem = 'tYES';
        entity.PurchaseItem = 'tYES';
        entity.ItemType = 'itItems';
        entity.ItemClass = 'itcMaterial';
        
        if(sku.code) entity.ItemCode = sku.code;
        if(sku.name) entity.ItemName = sku.name;
        if(sku.name) entity.ForeignName = sku.name;
        if(sku.itemGroup_code != null) entity.ItemsGroupCode = sku.itemGroup_code;
        if(sku.barcode != null) entity.BarCode = sku.barcode;
        
        if(sku.material_code != null) entity.MaterialType = sku.material_code;
        if(sku.ncm_code != null) entity.NCMCode = sku.ncm_code;
        if(sku.source_code != null) entity.ProductSource = sku.source_code;
        if(sku.cest_code != null) entity.CESTCode = sku.cest_code;

        if(sku.purchaseUnit_code != null) entity.PurchaseUnit = sku.purchaseUnit_code;
        if(sku.purchaseItemsPerUnit != null) entity.PurchaseItemsPerUnit = sku.purchaseItemsPerUnit;
        if(sku.purchasePack_code != null) entity.PurchasePackagingUnit = sku.purchasePack_code;
        if(sku.purchaseQtyPerPackUnit != null) entity.PurchaseQtyPerPackUnit = sku.purchaseQtyPerPackUnit;
        
        if(sku.salesUnit_code != null) entity.SalesUnit = sku.salesUnit_code;
        if(sku.salesItemsPerUnit != null) entity.SalesItemsPerUnit = sku.salesItemsPerUnit;
        if(sku.salesPack_code != null) entity.SalesPackagingUnit = sku.salesPack_code;
        if(sku.salesQtyPerPackUnit != null) entity.SalesQtyPerPackUnit = sku.salesQtyPerPackUnit;
        
        if(sku.vendor_code != null) entity.Mainsupplier = sku.vendor_code;
        if(sku.vendorReference != null) entity.SupplierCatalogNo = sku.vendorReference;
        if(sku.inventoryUOM_code != null) entity.InventoryUOM = sku.inventoryUOM_code;

        if(sku.salesUnitLength != null) entity.SalesUnitLength = parseFloat(sku.salesUnitLength);
        if(sku.salesLengthUnit_code != null) entity.SalesLengthUnit = sku.salesLengthUnit_code;
        if(sku.salesUnitWidth != null) entity.SalesUnitWidth = parseFloat(sku.salesUnitWidth);
        if(sku.salesWidthUnit_code != null) entity.SalesWidthUnit = sku.salesWidthUnit_code;
        if(sku.salesUnitHeight != null) entity.SalesUnitHeight = parseFloat(sku.salesUnitHeight);
        if(sku.salesHeightUnit_code != null) entity.SalesHeightUnit = sku.salesHeightUnit_code;
        if(sku.salesUnitVolume != null) entity.SalesUnitVolume = parseFloat(sku.salesUnitVolume);
        if(sku.salesVolumeUnit_code != null) entity.SalesVolumeUnit = sku.salesVolumeUnit_code;
        if(sku.salesUnitWeight != null) entity.SalesUnitWeight = parseFloat(sku.salesUnitWeight);
        if(sku.salesWeightUnit_code != null) entity.SalesWeightUnit = sku.salesWeightUnit_code;
        
        if(sku.purchaseUnitLength != null) entity.PurchaseUnitLength = parseFloat(sku.purchaseUnitLength);
        if(sku.purchaseLengthUnit_code != null) entity.PurchaseLengthUnit = sku.purchaseLengthUnit_code;
        if(sku.purchaseUnitWidth != null) entity.PurchaseUnitWidth = parseFloat(sku.purchaseUnitWidth);
        if(sku.purchaseWidthUnit_code != null) entity.PurchaseWidthUnit = sku.purchaseWidthUnit_code;
        if(sku.purchaseUnitHeight != null) entity.PurchaseUnitHeight = parseFloat(sku.purchaseUnitHeight);
        if(sku.purchaseHeightUnit_code != null) entity.PurchaseHeightUnit = sku.purchaseHeightUnit_code;
        if(sku.purchaseUnitVolume != null) entity.PurchaseUnitVolume = parseFloat(sku.purchaseUnitVolume);
        if(sku.purchaseVolumeUnit_code != null) entity.PurchaseVolumeUnit = sku.purchaseVolumeUnit_code;
        if(sku.purchaseUnitWeight != null) entity.PurchaseUnitWeight = parseFloat(sku.purchaseUnitWeight);
        if(sku.purchaseWeightUnit_code != null) entity.PurchaseWeightUnit = sku.purchaseWeightUnit_code;

        if(sku.brand_code != null) entity.U_GCV_brand_code = sku.brand_code;
        if(sku.collection_code != null) entity.U_GCV_collection_code = sku.collection_code;
        if(sku.category_code_1 != null) entity.U_GCV_category_code_1 = sku.category_code_1;
        if(sku.category_code_2 != null) entity.U_GCV_category_code_2 = sku.category_code_2;
        if(sku.category_code_3 != null) entity.U_GCV_category_code_3 = sku.category_code_3;
        if(sku.category_code_4 != null) entity.U_GCV_category_code_4 = sku.category_code_4;
        if(sku.category_code_5 != null) entity.U_GCV_category_code_5 = sku.category_code_5;
        if(sku.product_code != null) entity.U_GCV_product_code = sku.product_code;
        if(sku.variant_code != null) entity.U_GCV_variant_code = sku.variant_code;
        if(sku.color_code != null) entity.U_GCV_color_code = sku.color_code;
        if(sku.grid_code != null) entity.U_GCV_grid_code = sku.grid_code;
        if(sku.gridItem_prefix != null) entity.U_GCV_gridItem_prefix = sku.gridItem_prefix;

		return entity;
	}
}