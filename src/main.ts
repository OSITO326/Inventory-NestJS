import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilitar transformación
      whitelist: true, // Ignorar campos no definidos en el DTO
      forbidNonWhitelisted: true, // Lanzar error si hay campos no permitidos
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
