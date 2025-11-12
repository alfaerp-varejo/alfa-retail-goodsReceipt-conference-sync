import { Module } from '@nestjs/common';
import { HANA_CONNECTION, hanaProvider } from './hana.providers';
import { HanaService } from './hana.service';
import { ConfigModule } from 'src/core/config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [hanaProvider, HanaService],
    exports: [HanaService, HANA_CONNECTION],
})
export class HanaModule { }