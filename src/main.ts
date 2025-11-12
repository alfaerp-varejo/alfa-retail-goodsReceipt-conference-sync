import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 3000;

    // Instancia da fila
    await app.listen(port);

    console.log(`App rodando em http://localhost:${port}`);
}

bootstrap();