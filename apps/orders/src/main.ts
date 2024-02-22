import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const corsOptions = {
    origin: 'http://localhost:8080', // Allow only this origin
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  const config = new DocumentBuilder()
    .setTitle('Asset Orders microservice')
    .setDescription('docs of orders api endpoints')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();
