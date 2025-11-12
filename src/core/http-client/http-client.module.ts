import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [HttpClientService],
    exports: [HttpClientService],
})
export class HttpClientModule { }