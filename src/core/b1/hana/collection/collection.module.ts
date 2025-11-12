import { HanaCollectionService } from "./collection.service";
import { Module } from "@nestjs/common";
import { HanaModule } from "../database/hana.module";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [HanaModule, ConfigModule],
    controllers: [],
    providers: [HanaCollectionService],
    exports: [HanaCollectionService],
})
export class HanaCollectionModule { }