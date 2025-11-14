import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './core/config/config.module';
import { HanaGoodsReceiptConferenceModule } from './core/integrations/b1/hana/goods-receipt-conference/goods-receipt-conference.module';
import { HanaModule } from './core/integrations/b1/hana/database/hana.module';
import { hanaProvider } from './core/integrations/b1/hana/database/hana.providers';
import { BtpGoodsReceiptConferenceModule } from './core/integrations/btp/catalog/goods-receipt-conference/goods-receipt-conference.module';

@Module({
  imports: [
    ConfigModuleNest.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    HanaModule,
    HanaGoodsReceiptConferenceModule,
    BtpGoodsReceiptConferenceModule
  ],
  controllers: [],
  providers: [hanaProvider],
})
export class AppModule { }
