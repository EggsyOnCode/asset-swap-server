import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  BadRequestException,
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
  @Get('user/:userId')
  findUserAssets(@Param('userId', ParseIntPipe) userId: number) {
    if (isNaN(userId)) {
      // If userId is not a valid integer, throw a BadRequestException
      throw new BadRequestException(
        'Invalid userId. Please provide a valid integer.',
      );
    }

    // Use userId in your logic here
    return this.userAssetService.findAllAssetPerUser(userId);
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
