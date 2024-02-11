import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { Asset } from './entities/asset.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { RmqModule } from '@app/shared';
import { ASSET_SERVICE } from './constants/services';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/assets/.env',
    }),
    TypeOrmModule.forFeature([Asset]),
    RmqModule.register({
      name: ASSET_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetRepository],
})
export class AssetsModule {}
