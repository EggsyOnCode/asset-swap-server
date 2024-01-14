import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { UserAdvertizedAssetsService } from './advertized-assets.service';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserAdvertized } from './entities/userAdvertised.schema';

export class UserAssetParamsDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assetId: number;
}

@Controller('advertized-assets')
export class UserAdvertisedAssetsController {
  constructor(
    private readonly userAdvertService: UserAdvertizedAssetsService,
  ) {}

  @Get('seller/:sellerId')
  async findAllAdvertsOfSeller(@Param('sellerId') sellerId: number) {
    try {
      const result = await this.userAdvertService.findAllUserAdverts(sellerId);

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
    return this.userAdvertService.findOne(userId, assetId);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<UserAdvertized>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return this.userAdvertService.paginate(options);
  }

  @Post()
  create(@Body() assetDTO: CreateAdvertizedAssetDto) {
    return this.userAdvertService.create(assetDTO);
  }

  @Put(':userId/:assetId')
  update(
    @Param('userId') userId: number,
    @Param('assetId') assetId: number,
    @Body() assetDTO: UpdateAdvertizedAssetDto,
  ) {
    return this.userAdvertService.update(userId, assetId, assetDTO);
  }

  @Delete(':userId/:assetId')
  delete(@Param('userId') userId: number, @Param('assetId') assetId: number) {
    return this.userAdvertService.delete(userId, assetId);
  }
}
