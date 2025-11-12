import { Module } from '@nestjs/common';
import { CapService } from './cap.service';
import { ConfigModule } from 'src/core/config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [CapService],
    exports: [CapService],
})
export class CapModule {}
