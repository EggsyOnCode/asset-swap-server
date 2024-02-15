import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CreateUserAssetDto } from './dto/create-user-asset.dto';
import { UpdateUserAssetDto } from './dto/update-user-asset.dto';
import { UserAssetsService } from './user-assets.service';
import { IsNumber } from 'class-validator';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { UserInfoInterceptor } from './commons/userInfo.interceptor';

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
  @UseInterceptors(UserInfoInterceptor)
  findAll() {
    return this.userAssetService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findUserAssets(@Req() req) {
    const userId = req.user.userId;
    if (isNaN(userId)) {
      // If userId is not a valid integer, throw a BadRequestException
      throw new BadRequestException(
        'Invalid userId. Please provide a valid integer.',
      );
    }

    // Use userId in your logic here
    return this.userAssetService.findAllAssetPerUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/:assetId')
  findOne(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    // Use userId and assetId in your logic here
    return this.userAssetService.findOne(userId, assetId);
  }

  @Post()
  create(@Body() assetDTO: CreateUserAssetDto) {
    return this.userAssetService.create(assetDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId/:assetId')
  update(
    @Param('userId') userId: number,
    @Param('assetId') assetId: number,
    @Body() assetDTO: UpdateUserAssetDto,
  ) {
    return this.userAssetService.update(userId, assetId, assetDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/:assetId')
  delete(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    return this.userAssetService.delete(userId, assetId);
  }
}
