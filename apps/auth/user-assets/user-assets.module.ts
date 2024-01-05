import { Module } from '@nestjs/common';
import { UserAssetsService } from './user-assets.service';
import { UserAssetsController } from './user-assets.controller';

@Module({
  controllers: [UserAssetsController],
  providers: [UserAssetsService],
})
export class UserAssetsModule {}
