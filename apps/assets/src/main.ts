import { NestFactory } from '@nestjs/core';
import { AssetsModule } from './assets.module';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AssetsModule);
  // const config = await app.get(ConfigService);
  await app.listen(3000);
}
bootstrap();
