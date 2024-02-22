import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { RmqService } from '@app/shared';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUTH'));
  await app.startAllMicroservices();
  const corsOptions = {
    origin: 'http://localhost:8080', // Allow only this origin
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  const config = new DocumentBuilder()
    .setTitle('Asset Auth microservice')
    .setDescription('docs of auth api endpoints')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
