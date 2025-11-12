import { HanaCategoryService } from "./category.service";
import { Module } from "@nestjs/common";
import { HanaModule } from "../database/hana.module";
import { ConfigModule } from "src/core/config/config.module";

@Module({
    imports: [HanaModule, ConfigModule],
    controllers: [],
    providers: [HanaCategoryService],
    exports: [HanaCategoryService],
})
export class HanaCategoryModule { }