import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { Asset } from './entities/asset.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { RmqModule } from '@app/shared';
import { AUTH_SERVICE } from './constants/services';
import { AuthModule } from 'apps/auth/src/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/assets/.env',
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([Asset]),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetRepository],
})
export class AssetsModule {}
