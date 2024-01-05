import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateUserAssetDto } from './dto/create-user-asset.dto';
import { UpdateUserAssetDto } from './dto/update-user-asset.dto';
import { UserAssetsService } from './user-assets.service';
import { IsNumber } from 'class-validator';

export class UserAssetParamsDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assetId: number;
}

@Controller('user-assets')
export class UserAssetController {
  constructor(private readonly userAssetService: UserAssetsService) {}

  @Get()
  findAll() {
    return this.userAssetService.findAll();
  }

  @Get(':userId/:assetId')
  findOne(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    // Use userId and assetId in your logic here
    return this.userAssetService.findOne(userId, assetId);
  }

  @Post()
  create(@Body() assetDTO: CreateUserAssetDto) {
    return this.userAssetService.create(assetDTO);
  }

  @Put(':userId/:assetId')
  update(
    @Param('userId') userId: number,
    @Param('assetId') assetId: number,
    @Body() assetDTO: UpdateUserAssetDto,
  ) {
    return this.userAssetService.update(userId, assetId, assetDTO);
  }

  @Delete(':userId/:assetId')
  delete(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    return this.userAssetService.delete(userId, assetId);
  }
}
