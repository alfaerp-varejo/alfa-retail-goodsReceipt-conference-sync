import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HanaProductService } from "src/core/b1/hana/product/product.service";
import { ServiceLayerProductService } from "src/core/b1/serviceLayer/product/product.service";
import { ProductB1, ProductGCV, ProductSpecifB1, ProductVariantB1 } from "src/core/interfaces/product";
import { BtpCatalogProductService } from "src/core/btp/catalog/product/product.service";

@Injectable()
export class ProductService implements OnModuleInit {

    private logger = new Logger(ProductService.name);
    private isDev = process.env.NODE_ENV === 'development';
    private isRunning = false;

    constructor(
        private readonly dbService: HanaProductService,
        private readonly slService: ServiceLayerProductService,
        private readonly btpService: BtpCatalogProductService
    ) {
    }

    async onModuleInit() {
        if (this.isDev) {
            this.logger.warn('Ambiente de DEV: cron NÃO será executado automaticamente');
        }
    }

    @Cron(CronExpression.EVERY_MINUTE, { name: 'product-cron' })
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
                this.logger.log('PRODUCT - Consultando registros pendentes');

                const listItems = await this.btpService.getList();

                if(listItems.length === 0) {
                    this.logger.log('PRODUCT - Não encontrou registros pendentes');
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
            this.logger.log(`PRODUCT - Finalizando integração...`);
        }
    }

    async integrate(product: ProductGCV) {
        const { ID, code, name } = product;

        if(!ID) return;

        try {
            this.logger.log(`PRODUCT - Integrando registro ${code} - ${name}`);

            const exists = await this.dbService.checkExists(code);
           
			const data = this.mapAnyToEntity(product);

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

            this.logger.log(`PRODUCT - Integração ${code} - ${name} realizada com sucesso!`);

            return product;
        } catch (error) {
            this.logger.error(`PRODUCT - Erro ao integrar ${code} -> ${error.message}`);

            // await this.service.setReplicate(brand.Code);
            await this.btpService.setSyncFields(ID, {
                isSynced: true,
                lastSyncStatus_code: 'E',
                lastSyncDate: new Date(),
                lastSyncMessage: error.message
            });
        }
    }    

	private mapAnyToEntity(product: ProductGCV) {

        const _variants = product._variants || [];
        const _specifications = product._specifications || [];

		const entity: ProductB1 = {
            Code: product.code,
            Name: product.name,
            U_title: product.title,
            U_description: product.description,
            U_visible: (product.visible ? 'Y' : 'N'),
            U_active: (product.active ? 'Y' : 'N'),
            U_brand_code: product.brand_code,
            U_collection_code: product.collection_code,
            U_category_code_1: product.category_code_1,
            U_category_code_2: product.category_code_2,
            U_category_code_3: product.category_code_3,
            U_category_code_4: product.category_code_4,
            U_category_code_5: product.category_code_5,
            U_grid_code: product.grid_code,
            U_salePrice: parseFloat(product.salePrice || '0'),
            U_unitCost: parseFloat(product.unitCost || '0'),
            U_markup: parseFloat(product.markup || '0'),
            U_itemGroup_code: product.itemGroup_code,
            U_material_code: product.material_code,
            U_source_code: product.source_code,
            U_vendor_code: product.vendor_code,
            U_vendorReference: product.vendorReference,
            U_imageUrl: product.imageUrl,
            GCV_VARIANTSCollection: _variants.map((item, i): ProductVariantB1 => {
				return {
                    LineId: ++i,
                    U_variant_code: item.variant_code,
                    U_variant_name: item.variant_name,
                    U_color_code: item.color_code
				}
			}),
			GCV_PROD_SPECIFCollection: _specifications.map((item): ProductSpecifB1 => {
				return {
                    LineId: item.lineItem,
                    U_specification_code: item.specification_code,
                    U_value_code: item.value_code
				}
			})
		};        

		return entity;
	}
}