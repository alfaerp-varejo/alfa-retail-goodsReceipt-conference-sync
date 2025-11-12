import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './core/config/config.module';
import { HanaModule } from './core/b1/hana/database/hana.module';
import { hanaProvider } from './core/b1/hana/database/hana.providers';
import { HanaBrandModule } from './core/b1/hana/brand/brand.module';
import { BrandModule } from './services/brand/brand.module';
import { ServiceLayerBrandModule } from './core/b1/serviceLayer/brand/brand.module';
import { HanaCategoryModule } from './core/b1/hana/category/category.module';
import { ServiceLayerCategoryModule } from './core/b1/serviceLayer/category/category.module';
import { CategoryModule } from './services/category/category.module';
import { HanaCollectionModule } from './core/b1/hana/collection/collection.module';
import { ServiceLayerCollectionModule } from './core/b1/serviceLayer/collection/collection.module';
import { CollectionModule } from './services/collection/collection.module';
import { HanaColorModule } from './core/b1/hana/color/color.module';
import { ServiceLayerColorModule } from './core/b1/serviceLayer/color/color.module';
import { ColorModule } from './services/color/color.module';
import { HanaGridModule } from './core/b1/hana/grid/grid.module';
import { ServiceLayerGridModule } from './core/b1/serviceLayer/grid/grid.module';
import { GridModule } from './services/grid/grid.module';
import { HanaSpecifModule } from './core/b1/hana/specif/specif.module';
import { ServiceLayerSpecifModule } from './core/b1/serviceLayer/specif/specif.module';
import { SpecifModule } from './services/specif/specif.module';
import { HanaProductModule } from './core/b1/hana/product/product.module';
import { ServiceLayerProductModule } from './core/b1/serviceLayer/product/product.module';
import { ProductModule } from './services/product/product.module';
import { HanaSkuModule } from './core/b1/hana/sku/sku.module';
import { ServiceLayerSkuModule } from './core/b1/serviceLayer/sku/sku.module';
import { SkuModule } from './services/sku/sku.module';

@Module({
  imports: [
    ConfigModuleNest.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    HanaModule,
    HanaBrandModule,
    HanaCategoryModule,
    HanaCollectionModule,
    HanaColorModule,
    HanaGridModule,
    HanaSpecifModule,
    HanaProductModule,
    HanaSkuModule,
    ServiceLayerBrandModule,
    ServiceLayerCategoryModule,
    ServiceLayerCollectionModule,
    ServiceLayerColorModule,
    ServiceLayerGridModule,
    ServiceLayerSpecifModule,
    ServiceLayerProductModule,
    ServiceLayerSkuModule,
    BrandModule,
    CategoryModule,
    CollectionModule,
    ColorModule,
    GridModule,
    SpecifModule,
    ProductModule,
    SkuModule
  ],
  controllers: [],
  providers: [hanaProvider],
})
export class AppModule { }
