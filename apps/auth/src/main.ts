import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { RmqService } from '@app/shared';
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
  await app.listen(3000);
}
bootstrap();
