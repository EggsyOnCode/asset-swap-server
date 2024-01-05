import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdvertizedAssetsService } from './advertized-assets.service';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';

@Controller('advertized-assets')
export class AdvertizedAssetsController {
  constructor(private readonly advertizedAssetsService: AdvertizedAssetsService) {}

  @Post()
  create(@Body() createAdvertizedAssetDto: CreateAdvertizedAssetDto) {
    return this.advertizedAssetsService.create(createAdvertizedAssetDto);
  }

  @Get()
  findAll() {
    return this.advertizedAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertizedAssetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdvertizedAssetDto: UpdateAdvertizedAssetDto) {
    return this.advertizedAssetsService.update(+id, updateAdvertizedAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertizedAssetsService.remove(+id);
  }
}
