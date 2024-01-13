import { Module } from '@nestjs/common';
import { UserAssetsService } from './user-assets.service';
import { UserAssetController } from './user-assets.controller';
import { UserAssetRepo } from './userAsset.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAssets } from './entities/userAssets.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserAssets])],
  controllers: [UserAssetController],
  providers: [UserAssetsService, UserAssetRepo],
})
export class UserAssetsModule {}
