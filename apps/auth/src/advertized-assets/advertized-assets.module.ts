import { Module } from '@nestjs/common';
import { UserAdvertizedAssetsService } from './advertized-assets.service';
import { UserAdvertisedAssetsController } from './advertized-assets.controller';
import { UserAdvertizedRepository } from './userAdvertised.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAdvertized } from './entities/userAdvertised.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserAdvertized])],
  controllers: [UserAdvertisedAssetsController],
  providers: [UserAdvertizedAssetsService, UserAdvertizedRepository],
})
export class AdvertizedAssetsModule {}
