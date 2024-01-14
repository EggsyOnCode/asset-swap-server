import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { UserAdvertizedAssetsService } from './advertized-assets.service';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';

export class UserAssetParamsDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assetId: number;
}

@Controller('advertized-assets')
export class UserAdvertisedAssetsController {
  constructor(private readonly userAssetService: UserAdvertizedAssetsService) {}

  @Get('seller/:sellerId')
  async findAllAdvertsOfSeller(@Param('sellerId') sellerId: number) {
    try {
      const result = await this.userAssetService.findAllUserAdverts(sellerId);

      if (!result) {
        // If the result is null, the user was not found
        throw new NotFoundException(`Seller with ID ${sellerId} not found.`);
      }

      // Handle the result or do further processing if needed
      return result;
    } catch (error) {
      // Handle other errors
      throw error;
    }
  }

  @Get(':userId/:assetId')
  findOne(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    // Use userId and assetId in your logic here
    return this.userAssetService.findOne(userId, assetId);
  }
  @Get()
  findAll() {
    return this.userAssetService.findAll();
  }

  @Post()
  create(@Body() assetDTO: CreateAdvertizedAssetDto) {
    return this.userAssetService.create(assetDTO);
  }

  @Put(':userId/:assetId')
  update(
    @Param('userId') userId: number,
    @Param('assetId') assetId: number,
    @Body() assetDTO: UpdateAdvertizedAssetDto,
  ) {
    return this.userAssetService.update(userId, assetId, assetDTO);
  }

  @Delete(':userId/:assetId')
  delete(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    return this.userAssetService.delete(userId, assetId);
  }
}
