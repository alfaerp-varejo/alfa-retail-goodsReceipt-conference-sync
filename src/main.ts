import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ServiceLayerManager from './core/integrations/b1/serviceLayer/service-layer.manager';
import { ConfigService } from './core/config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    
    const port = process.env.PORT ?? 3000;

    // Cria sessão na base principal
    await ServiceLayerManager.init(configService, false, 2);

    // Instancia da fila
    await app.listen(port);

    console.log(`App rodando em http://localhost:${port}`);
}

bootstrap();