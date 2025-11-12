import { Module } from "@nestjs/common";
import { CollectionService } from "./collection.service";
import { HanaCollectionModule } from "src/core/b1/hana/collection/collection.module";
import { CollectionController } from "./collection.controller";
import { ConfigModule } from "src/core/config/config.module";
import { ServiceLayerCollectionModule } from "src/core/b1/serviceLayer/collection/collection.module";
import { BtpCatalogCollectionModule } from "src/core/btp/catalog/collection/collection.module";

@Module({
    imports: [
        ConfigModule,
        HanaCollectionModule,
        ServiceLayerCollectionModule,
        BtpCatalogCollectionModule
    ],
    providers: [CollectionService],
    controllers: [CollectionController],
    exports: [CollectionService],
})
export class CollectionModule { }