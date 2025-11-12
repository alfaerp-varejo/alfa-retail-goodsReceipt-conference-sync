import { HanaSkuService } from "./sku.service";
import { Module } from "@nestjs/common";
import { HanaModule } from "../database/hana.module";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [HanaModule, ConfigModule],
    controllers: [],
    providers: [HanaSkuService],
    exports: [HanaSkuService],
})
export class HanaSkuModule { }