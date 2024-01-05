import { Module } from '@nestjs/common';
import { AdvertizedAssetsService } from './advertized-assets.service';
import { AdvertizedAssetsController } from './advertized-assets.controller';

@Module({
  controllers: [AdvertizedAssetsController],
  providers: [AdvertizedAssetsService],
})
export class AdvertizedAssetsModule {}
