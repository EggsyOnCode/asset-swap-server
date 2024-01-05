import { NestFactory } from '@nestjs/core';
import { AssetsModule } from './assets.module';
import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AssetsModule);
  // const config = await app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
