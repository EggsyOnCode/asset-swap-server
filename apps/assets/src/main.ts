import { NestFactory } from '@nestjs/core';
import { AssetsModule } from './assets.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AssetsModule);
  // const config = await app.get(ConfigService);
  const corsOptions = {
    origin: 'http://localhost:8080', // Allow only this origin
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
