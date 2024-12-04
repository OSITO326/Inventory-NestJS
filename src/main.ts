import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Inventory Diecast Hunters');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilitar transformación
      whitelist: true, // Ignorar campos no definidos en el DTO
      forbidNonWhitelisted: true, // Lanzar error si hay campos no permitidos
    }),
  );
  await app.listen(envs.port);
  logger.log(`Gateway running on port: ${envs.port}`);
}
bootstrap();
