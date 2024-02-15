import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { Asset } from './entities/asset.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { AwsUtilsModule, NftStorageModule, RmqModule } from '@app/shared';
import { AUTH_SERVICE } from './constants/services';
import { AuthModule } from 'apps/auth/src/auth.module';
import * as Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    EventEmitterModule.forRoot(),
    AwsUtilsModule,
    NftStorageModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetRepository],
})
export class AssetsModule {}
