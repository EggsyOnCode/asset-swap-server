// assets.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { updateAssetDto } from './updateAssetd.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assetsService.findOne(id);
  }

  @Post()
  create(@Body() assetDTO: CreateAssetDto) {
    return this.assetsService.create(assetDTO);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() assetDTO: updateAssetDto) {
    return this.assetsService.update(id, assetDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.assetsService.delete(id);
  }
}
