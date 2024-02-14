import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const corsOptions = {
    origin: 'http://localhost:8080', // Allow only this origin
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  await app.listen(5000);
}
bootstrap();
